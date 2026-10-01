<?php

namespace Tests\Concerns;

use App\Enums\RoleEnum;
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
use Illuminate\Support\Collection;

trait CreatesSchoolTestData
{
    private function createAdminUser()
    {
        $user = User::factory()->create(['role' => RoleEnum::ADMIN->value]);
        return $user;
    }

    private function createTeacherUser()
    {
        $user = User::factory()->create(['role' => RoleEnum::TEACHER->value]);
        Teacher::factory()->create(['user_id' => $user->id]);
        return $user;
    }

    private function createStudentUser($count = 1)
    {
        $users  = collect();

        for ($i = 0; $i < $count; $i++) {
            $user = User::factory()->create(['role' => RoleEnum::STUDENT->value]);
            Student::factory()->create(['user_id' => $user->id]);
            $users->add($user);
        }

        return $users;
    }
    private function createAcademicYears(int $start = 2020, int $end = 2026)
    {
        $academicYear = collect();
        foreach (range($start, $end) as $startYear) {
            $academicYear->add(AcademicYear::query()->updateOrCreate(
                ['name' => $startYear . '-' . ($startYear + 1)],
                [
                    'starts_at' => $startYear . '-09-01',
                    'ends_at' => ($startYear + 1) . '-06-30',
                ]
            ));
        }

        return  $academicYear;
    }
    private function createClasses($count = 1)
    {
        return SchoolClass::factory($count)->create();
    }
    private function createSubjects($count = 1)
    {
        return Subject::factory($count)->create();
    }

    private function createTeachingContext(Teacher $teacher, AcademicYear $academicYear, SchoolClass $sclass, Subject $subject)
    {
        return TeachingAssignment::factory()->create([
            'teacher_id' => $teacher->id,
            'academic_year_id' => $academicYear->id,
            'class_id' => $sclass->id,
            'subject_id' => $subject->id,
        ]);

    }
    private function createStudentWithEnrollment(AcademicYear $academicYear, SchoolClass $sclass, int $count = 10)
    {
        $userStudents = $this->createStudentUser($count);

        $userStudents->each(function ($user) use ($academicYear, $sclass) {
            $student = $user->student;
            Enrollment::factory()->create([
                'student_id' => $student->id,
                'academic_year_id' => $academicYear->id,
                'class_id' => $sclass->id,
            ]);
        });
        return $userStudents;
    }


    private function createExamWithGrades(Collection $userStudents, TeachingAssignment $teaching_assignment)
    {
        $exam = Exam::factory()->create([
            'teaching_assignment_id' => $teaching_assignment->id
        ]);
        $userStudents->each(function ($user) use ($exam) {
            $student = $user->student;
            $g = Grade::factory()->create([
                'student_id' => $student->id,
                'exam_id' => $exam->id,
            ]);
        });

        $exam->refresh();
        $exam->with('grades');

        return $exam;
    }
}
