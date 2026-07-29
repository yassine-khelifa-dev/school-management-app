<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // $create an admin
        User::factory()->create([
            'role' => 'admin'
        ]);


        $user_students =  User::factory(200)->create([
            'role' => 'student'
        ]);
        $students = $user_students->map(function (User $user) {
            return Student::factory()
                ->for($user)
                ->create();
        });

        $user_teachers =  User::factory(40)->create([
            'role' => 'teacher'
        ]);
        $teachers = $user_teachers->map(function (User $user) {
            return Teacher::factory()
                ->for($user)
                ->create();
        });


        $academicYears = collect();
        $years = range(2010, 2026);
        foreach ($years as $year) {
            $academicYears->push(
                
                AcademicYear::factory()->create([
                    'name' => $year . '-' . ($year + 1),
                    'starts_at' => $year . '-09-01',
                    'ends_at' => ($year + 1) . '-06-30',
                ])
            );
        }

        $schoolClasses = SchoolClass::factory(10)->create();

        $subjects = Subject::factory(20)->create();


        foreach ($students as  $student) {
            Enrollment::factory()->create([
                'student_id' => $student->id,
                'class_id' => $schoolClasses->random()->id,
                'academic_year_id' => $academicYears->random()->id,
            ]);
        }
    }
}
