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

class Assignments(BaseModel):
    subject: str
    weekly_lessons: int
    class_name: str

class TeacherInfo(BaseModel):
    teacher: str
    assignments: List[Assignments]

class ScheduleRequest(BaseModel):
    teachers: List[TeacherInfo]
    days_per_week: Union[int, List[int]] = 5
    periods_per_day: int = 6
    enforce_required_lessons: bool = True
    max_subjects_per_day: int = 1
    enforce_teacher_no_double_booking: bool = True
    enforce_one_subject_per_period: bool = True

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

@app.get("/")
def read_root():
    return {"status": "API is running"}

@app.post("/schedule")
def schedule(data: ScheduleRequest):
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

    # Constraint 1: Assign required weekly lessons
    for teacher_info in data.teachers:
        teacher = teacher_info.teacher
        for assignment in teacher_info.assignments:
            lesson_sum = sum(
                schedule[(teacher, assignment.subject, assignment.class_name, day, period)]
                for day in days for period in range(periods_per_day)
            )
            if data.enforce_required_lessons:
                model.Add(lesson_sum == assignment.weekly_lessons)
            else:
                model.Add(lesson_sum >= 1)

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
            "days": days,
            "periods_per_day": periods_per_day,
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
