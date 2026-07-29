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
    private const COUNT_EXAMS = 400;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        // $create an admin
        User::factory()->create([
            'role' => 'admin'
        ]);

        // Academic Yers:
        $academicYears = collect();
        $years = range(2000, 2026);
        foreach ($years as $year) {
            $academicYears->push(

                AcademicYear::factory()->create([
                    'name' => $year . '-' . ($year + 1),
                    'starts_at' => $year . '-09-01',
                    'ends_at' => ($year + 1) . '-06-30',
                ])
            );
        }

        // Classes:
        $schoolClasses = SchoolClass::factory(70)->create();


        // Students:
        $userStudents =  User::factory(self::COUNT_STUDENTS)->create([
            'role' => 'student'
        ]);
        $students = $userStudents->map(function (User $user) {
            return Student::factory()
                ->for($user)
                ->create();
        });

        // Enrollments:
        foreach ($students as  $student) {
            Enrollment::factory()->create([
                'student_id' => $student->id,
                'class_id' => $schoolClasses->random()->id,
                'academic_year_id' => $academicYears->random()->id,
            ]);
        }

        // Subjects:
        $subjects = Subject::factory(50)->create();

        // Teachers:
        $userTeachers =  User::factory(self::COUNT_TEACHERS)->create([
            'role' => 'teacher'
        ]);
        $teachers = $userTeachers->map(function (User $user) {
            return Teacher::factory()
                ->for($user)
                ->create();
        });


        // Random assignment is acceptable for development data.
        // The database unique constraint protects business integrity.
        // teaching assignments:
        $teachingAssignments = collect();
        foreach ($teachers as  $teacher) {
            $teachingAssignments->push(TeachingAssignment::factory()->create([
                'teacher_id' => $teacher->id,
                'class_id' => $schoolClasses->random()->id,
                'subject_id' => $subjects->random()->id,
                'academic_year_id' => $academicYears->random()->id
            ]));
        }

        // Exams:
        $exams = Exam::factory(self::COUNT_EXAMS)
            ->recycle($teachingAssignments)
            ->create();


        // Grades:
        foreach ($students as $student) {
            Grade::factory()->create([
                'exam_id' => $exams->random()->id,
                'student_id' => $student->id
            ]);
        }
    }
}
