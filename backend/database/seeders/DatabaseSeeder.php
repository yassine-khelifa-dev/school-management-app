<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    private const COUNT_STUDENTS = 5000;
    private const COUNT_TEACHERS = 400;

    private const STUDENTS_PER_CLASS = 35;
    private const SUBJECTS_PER_CLASS = 8;
    private const EXAMS_PER_SUBJECT = 3;

    public function run(): void
    {
        // Admin
        User::factory()->create([
            'role' => 'admin',
        ]);

        // Academic Years
        $academicYears = collect();

        foreach (range(2000, 2026) as $year) {
            $academicYears->push(
                AcademicYear::factory()->create([
                    'name' => $year . '-' . ($year + 1),
                    'starts_at' => $year . '-09-01',
                    'ends_at' => ($year + 1) . '-06-30',
                ])
            );
        }

        // Use the latest academic year for our performance dataset
        $currentAcademicYear = $academicYears->last();

        // Classes
        // 5000 / ~140 = around 35 students per class
        $schoolClasses = SchoolClass::factory(140)->create();

        // Subjects
        $subjects = Subject::factory(50)->create();

        // Students
        $userStudents = User::factory(self::COUNT_STUDENTS)->create([
            'role' => 'student',
        ]);

        $students = $userStudents->map(
            fn(User $user) =>
            Student::factory()
                ->for($user)
                ->create()
        );

        // Teachers
        $userTeachers = User::factory(self::COUNT_TEACHERS)->create([
            'role' => 'teacher',
        ]);

        $teachers = $userTeachers->map(
            fn(User $user) =>
            Teacher::factory()
                ->for($user)
                ->create()
        );

        /*
        |--------------------------------------------------------------------------
        | Enrollments
        |--------------------------------------------------------------------------
        |
        | Around 35 students per class in the same academic year.
        |
        */

        $students
            ->shuffle()
            ->chunk(self::STUDENTS_PER_CLASS)
            ->each(function ($studentGroup, $index) use (
                $schoolClasses,
                $currentAcademicYear
            ) {
                $class = $schoolClasses[$index % $schoolClasses->count()];

                foreach ($studentGroup as $student) {
                    Enrollment::factory()->create([
                        'student_id' => $student->id,
                        'class_id' => $class->id,
                        'academic_year_id' => $currentAcademicYear->id,
                    ]);
                }
            });

        /*
        |--------------------------------------------------------------------------
        | Teaching Assignments
        |--------------------------------------------------------------------------
        |
        | Each class gets 8 subjects.
        |
        */

        $teachingAssignments = collect();

        foreach ($schoolClasses as $class) {
            $classSubjects = $subjects->random(
                self::SUBJECTS_PER_CLASS
            );

            foreach ($classSubjects as $subject) {
                $teacher = $teachers->random();

                $assignment = TeachingAssignment::factory()->create([
                    'teacher_id' => $teacher->id,
                    'class_id' => $class->id,
                    'subject_id' => $subject->id,
                    'academic_year_id' => $currentAcademicYear->id,
                ]);

                $teachingAssignments->push($assignment);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Exams + Grades
        |--------------------------------------------------------------------------
        |
        | Each class/subject gets 3 exams.
        | Only students enrolled in that class/year receive grades.
        |
        */

        foreach ($teachingAssignments as $assignment) {

            $classStudents = Student::query()
                ->whereHas('enrollments', function ($query) use ($assignment) {
                    $query
                        ->where('class_id', $assignment->class_id)
                        ->where(
                            'academic_year_id',
                            $assignment->academic_year_id
                        );
                })
                ->get();

            if ($classStudents->isEmpty()) {
                continue;
            }

            $exams = Exam::factory(self::EXAMS_PER_SUBJECT)->create([
                'teaching_assignment_id' => $assignment->id,
            ]);

            foreach ($exams as $exam) {
                foreach ($classStudents as $student) {
                    Grade::factory()->create([
                        'exam_id' => $exam->id,
                        'student_id' => $student->id,
                    ]);
                }
            }
        }
    }
}
