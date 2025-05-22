from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Union
from ortools.sat.python import cp_model
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

all_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

def get_days(days_input: Union[int, List[int]]) -> List[str]:
    if isinstance(days_input, int):
        if not (1 <= days_input <= len(all_days)):
            raise HTTPException(status_code=400, detail=f"days_per_week integer must be between 1 and {len(all_days)}")
        # Return first N days starting from Sunday
        return all_days[:days_input]
    elif isinstance(days_input, list):
        # Validate indexes
        for d in days_input:
            if not isinstance(d, int) or not (0 <= d < len(all_days)):
                raise HTTPException(status_code=400, detail=f"Invalid day index: {d}")
        # Return days in order given by user
        return [all_days[d] for d in days_input]
    else:
        raise HTTPException(status_code=400, detail="days_per_week must be int or list of int")

# ---------------------------
# Models for Class-based Scheduling
# ---------------------------

class ClassSubject(BaseModel):
    subject: str
    weekly_hours: int
    teacher: str

class ClassInfo(BaseModel):
    class_name: str
    subjects: List[ClassSubject]

class ClassScheduleRequest(BaseModel):
    classes: List[ClassInfo]
    days_per_week: Union[int, List[int]] = 5
    periods_per_day: int = 6
    enforce_required_hours: bool = True
    max_subjects_per_day: int = 1
    enforce_one_subject_per_period: bool = True
    enforce_teacher_no_double_booking: bool = True

@app.post("/class_schedule")
def class_schedule(data: ClassScheduleRequest):
    model = cp_model.CpModel()
    schedule = {}

    days = get_days(data.days_per_week)
    periods_per_day = data.periods_per_day

    # Decision variables
    for class_info in data.classes:
        for subject in class_info.subjects:
            for day in days:
                for period in range(periods_per_day):
                    key = (class_info.class_name, subject.subject, day, period)
                    schedule[key] = model.NewBoolVar(f"{class_info.class_name}_{subject.subject}_{day}_P{period}")

    # Constraint 1: Allocate required hours per subject per class
    if data.enforce_required_hours:
        for class_info in data.classes:
            for subject in class_info.subjects:
                model.Add(
                    sum(schedule[(class_info.class_name, subject.subject, day, period)] for day in days for period in range(periods_per_day)) 
                    == subject.weekly_hours
                )

    # Constraint 2: Max subjects per day per class
    for class_info in data.classes:
        for subject in class_info.subjects:
            for day in days:
                model.Add(
                    sum(schedule[(class_info.class_name, subject.subject, day, period)] for period in range(periods_per_day)) <= data.max_subjects_per_day
                )

    # Constraint 3: One subject per class per period
    if data.enforce_one_subject_per_period:
        for class_info in data.classes:
            for day in days:
                for period in range(periods_per_day):
                    model.Add(
                        sum(schedule[(class_info.class_name, subject.subject, day, period)] for subject in class_info.subjects) <= 1
                    )

    # Constraint 4: No teacher double-booking
    if data.enforce_teacher_no_double_booking:
        teacher_assignments = {}
        for class_info in data.classes:
            for subject in class_info.subjects:
                teacher_assignments.setdefault(subject.teacher, []).append(
                    (class_info.class_name, subject.subject)
                )

        for teacher, assignments in teacher_assignments.items():
            for day in days:
                for period in range(periods_per_day):
                    model.Add(
                        sum(schedule[(class_name, subject, day, period)] for (class_name, subject) in assignments) <= 1
                    )

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status in [cp_model.FEASIBLE, cp_model.OPTIMAL]:
        class_timetables = {}
        for class_info in data.classes:
            class_name = class_info.class_name
            class_timetables[class_name] = {}
            for day in days:
                class_timetables[class_name][day] = []
                for period in range(periods_per_day):
                    for subject in class_info.subjects:
                        if solver.Value(schedule[(class_name, subject.subject, day, period)]):
                            class_timetables[class_name][day].append({
                                "period": period + 1,
                                "subject": subject.subject,
                                "teacher": subject.teacher
                            })

        teacher_timetables = {}
        for class_name, day_sched in class_timetables.items():
            for day, periods in day_sched.items():
                for period_info in periods:
                    teacher = period_info["teacher"]
                    teacher_timetables.setdefault(teacher, {}).setdefault(day, []).append({
                        "period": period_info["period"],
                        "subject": period_info["subject"],
                        "class": class_name
                    })

        return {
            "status": "success",
            "class_timetables": class_timetables,
            "teacher_timetables": teacher_timetables,
        }
    else:
        raise HTTPException(status_code=400, detail="No feasible timetable found for class schedule")

# ---------------------------
# Models for Teacher-based Scheduling
# ---------------------------

class TeacherAssignment(BaseModel):
    subject: str
    weekly_hours: int
    class_name: str

class TeacherInfo(BaseModel):
    teacher: str
    assignments: List[TeacherAssignment]

class TeacherScheduleRequest(BaseModel):
    teachers: List[TeacherInfo]
    days_per_week: Union[int, List[int]] = 5
    periods_per_day: int = 6
    enforce_required_hours: bool = True
    max_subjects_per_day: int = 1
    enforce_teacher_no_double_booking: bool = True
    enforce_one_subject_per_period: bool = True

@app.post("/teacher_schedule")
def teacher_schedule(data: TeacherScheduleRequest):
    model = cp_model.CpModel()
    schedule = {}

    days = get_days(data.days_per_week)
    periods_per_day = data.periods_per_day

    # Decision variables
    for teacher_info in data.teachers:
        teacher = teacher_info.teacher
        for assignment in teacher_info.assignments:
            for day in days:
                for period in range(periods_per_day):
                    key = (teacher, assignment.subject, assignment.class_name, day, period)
                    schedule[key] = model.NewBoolVar(f"{teacher}_{assignment.subject}_{assignment.class_name}_{day}_P{period}")

    # Constraint 1: Assign required weekly hours
    if data.enforce_required_hours:
        for teacher_info in data.teachers:
            teacher = teacher_info.teacher
            for assignment in teacher_info.assignments:
                model.Add(
                    sum(schedule[(teacher, assignment.subject, assignment.class_name, day, period)] for day in days for period in range(periods_per_day))
                    == assignment.weekly_hours
                )

    # Constraint 2: Max subjects per day
    for teacher_info in data.teachers:
        for assignment in teacher_info.assignments:
            for day in days:
                model.Add(
                    sum(schedule[(teacher_info.teacher, assignment.subject, assignment.class_name, day, period)] for period in range(periods_per_day)) <= data.max_subjects_per_day
                )

    # Constraint 3: No double-booking per teacher
    if data.enforce_teacher_no_double_booking:
        for teacher_info in data.teachers:
            teacher = teacher_info.teacher
            for day in days:
                for period in range(periods_per_day):
                    model.Add(
                        sum(schedule[(teacher, assignment.subject, assignment.class_name, day, period)] for assignment in teacher_info.assignments) <= 1
                    )

    # Constraint 4: One subject per class per period
    if data.enforce_one_subject_per_period:
        classes = set()
        for teacher_info in data.teachers:
            for assignment in teacher_info.assignments:
                classes.add(assignment.class_name)
        for class_name in classes:
            for day in days:
                for period in range(periods_per_day):
                    model.Add(
                        sum(
                            schedule.get((teacher_info.teacher, assignment.subject, class_name, day, period), 0)
                            for teacher_info in data.teachers
                            for assignment in teacher_info.assignments if assignment.class_name == class_name
                        ) <= 1
                    )

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status in [cp_model.FEASIBLE, cp_model.OPTIMAL]:
        teacher_timetables = {}
        for teacher_info in data.teachers:
            teacher = teacher_info.teacher
            teacher_timetables[teacher] = {}
            for day in days:
                teacher_timetables[teacher][day] = []
                for period in range(periods_per_day):
                    for assignment in teacher_info.assignments:
                        if solver.Value(schedule[(teacher, assignment.subject, assignment.class_name, day, period)]):
                            teacher_timetables[teacher][day].append({
                                "period": period + 1,
                                "subject": assignment.subject,
                                "class": assignment.class_name
                            })

        class_timetables = {}
        for teacher, day_sched in teacher_timetables.items():
            for day, periods in day_sched.items():
                for period_info in periods:
                    class_name = period_info["class"]
                    class_timetables.setdefault(class_name, {}).setdefault(day, []).append({
                        "period": period_info["period"],
                        "subject": period_info["subject"],
                        "teacher": teacher
                    })

        return {
            "status": "success",
            "teacher_timetables": teacher_timetables,
            "class_timetables": class_timetables,
        }
    else:
        raise HTTPException(status_code=400, detail="No feasible timetable could be generated. Please try adjusting your parameters and try again")

# ---------------------------
# Entry point
# ---------------------------

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
