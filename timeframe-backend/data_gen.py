import pandas as pd
import random

def generate_timetable_excel(filename="junior_school_timetable.xlsx"):
    # Define teachers and which grades & subjects they teach
    # Format: teacher_name: {subject: [grades]}
    teachers = {
        "Ms. Adams": {"Maths": [4, 5]},              # teaches Maths for grades 4,5
        "Mr. Brown": {"Maths": [6, 7]},              # teaches Maths for grades 6,7
        "Mrs. Clarke": {"English": [4,5,6,7]},       # English all grades
        "Mr. Davies": {"Technology": [4,5,6,7]},     # Technology all grades
        "Ms. Evans": {"Natural Science": [4,5,6]},   # NS grades 4,5,6
        "Ms. Harris": {"Natural Science": [7], "Social Science": [7]}, # NS & SS grade 7
        "Ms. Foster": {"Life Orientation": [4,5,6,7]}, # Life Orientation all grades
        "Mr. Green": {"Physical Education": [4,5,6,7]}, # Phys Ed all grades, only teacher
        "Mrs. Jenkins": {"Art": [4,5,6,7]},           # Art all grades
        "Mr. Irving": {"Economic Management Science": [4,5,6,7]}, # EMS all grades
        "Mrs. Lee": {"Second Language": [4,5,6]},     # Second language grades 4,5,6
        "Mr. White": {"Second Language": [7]},        # Second language grade 7
        "Ms. Clarke": {"Social Science": [4,5,6]},   # SS grades 4,5,6 (shared teacher)
    }

    # Define subjects and weekly lessons
    subjects_lessons = {
        "Maths": 5,
        "English": 5,
        "Second Language": 3,
        "Technology": 2,
        "Natural Science": 2,
        "Life Orientation": 2,
        "Physical Education": 1,
        "Social Science": 2,
        "Economic Management Science": 1,
        "Art": 2,
    }

    grades = [4, 5, 6, 7]

    # Randomize number of classes per grade (between 2 and 4)
    random.seed(42)
    classes_per_grade = {grade: random.choice([2, 3, 4]) for grade in grades}

    rows = []

    for grade in grades:
        num_classes = classes_per_grade[grade]
        for class_num in range(num_classes):
            class_name = f"Grade {grade}{chr(ord('A') + class_num)}"
            # For each subject, find teacher(s) that teach it for this grade
            for subject, lessons in subjects_lessons.items():
                # Find teachers who teach this subject for this grade
                possible_teachers = []
                for teacher, subs in teachers.items():
                    if subject in subs and grade in subs[subject]:
                        possible_teachers.append(teacher)
                # Assign a random teacher from possible teachers (usually one, but if multiple choose random)
                if possible_teachers:
                    assigned_teacher = random.choice(possible_teachers)
                else:
                    assigned_teacher = "TBD"  # In case no teacher assigned (shouldn't happen here)
                rows.append({
                    "Teacher": assigned_teacher,
                    "Class": class_name,
                    "Subject": subject,
                    "lessons per Week": lessons
                })

    # Create DataFrame and save to Excel
    df = pd.DataFrame(rows)
    df.to_excel(filename, index=False)
    print(f"Timetable saved to {filename}")

if __name__ == "__main__":
    generate_timetable_excel()
