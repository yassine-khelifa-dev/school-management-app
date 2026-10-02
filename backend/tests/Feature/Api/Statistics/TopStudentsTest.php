<?php

namespace Tests\Feature\Api\Statistics;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesSchoolTestData;
use Tests\TestCase;

class TopStudentsTest extends TestCase
{
    use RefreshDatabase, CreatesSchoolTestData;

    public function test_statistics_top_students_endpoint_done(): void
    {
        // Create an admin and basic school data
        $this->actingAs($this->createAdminUser());

        $a = $this->createAcademicYears(2025, 2026);
        $subject = $this->createSubjects(1);
        $c = $this->createClasses(1);

        // Link the subject to a teacher, class and academic year
        $this->createTeachingContext(
            $this->createTeacherUser()->teacher,
            $a->first(),
            $c->first(),
            $subject->first()
        );

        // Call the endpoint
        $response = $this->getJson(
            "/api/statistics/subjects/" . $subject->first()->id .
                "/top-students?academic_year=" . $a->first()->id
        );

        // Check the basic response structure
        $response->assertStatus(200);
        $response->assertJsonPath('subject.id', $subject->first()->id);
        $response->assertJsonIsArray('top_students');
    }

    public function test_top_students_endpoint_returns_subject_and_students_array_role_admin(): void
    {
        // Prepare the school context
        $this->actingAs($this->createAdminUser());

        $a = $this->createAcademicYears(2025, 2026);
        $subject = $this->createSubjects(1);
        $c = $this->createClasses(1);

        $teachingAssignment = $this->createTeachingContext(
            $this->createTeacherUser()->teacher,
            $a->first(),
            $c->first(),
            $subject->first()
        );

        // Create students and grades for this subject
        $students = $this->createStudentWithEnrollment(
            $a->first(),
            $c->first(),
            15
        );

        $this->createExamWithGrades(
            $students,
            $teachingAssignment
        );

        // Request only the top 4 students
        $response = $this->getJson(
            "/api/statistics/subjects/" . $subject->first()->id .
                "/top-students?academic_year=" . $a->first()->id .
                "&limit=4"
        );

        // Check the returned data
        $response->assertStatus(200);
        $response->assertJsonPath('subject.id', $subject->first()->id);
        $response->assertJsonIsArray('top_students');
        $response->assertJsonCount(4, 'top_students');

        $averages = collect($response->json('top_students'))
            ->pluck('average');

        // Averages should already be sorted from highest to lowest
        $this->assertEquals(
            $averages->sortDesc()->values()->all(),
            $averages->values()->all()
        );

        // Normalized averages must stay within 100
        $this->assertLessThanOrEqual(
            100,
            $averages->first()
        );
    }




    public function test_teacher_cannot_access_top_students_for_unassigned_subject(): void
    {
        // Prepare the school context
        $this->actingAs($this->createTeacherUser());

        $a = $this->createAcademicYears(2025, 2026);
        $subject = $this->createSubjects(1);
        $c = $this->createClasses(1);

        $teachingAssignment = $this->createTeachingContext(
            $this->createTeacherUser()->teacher, // another teacher
            $a->first(),
            $c->first(),
            $subject->first()
        );
        // Request only the top 4 students
        $response = $this->getJson(
            "/api/statistics/subjects/" . $subject->first()->id .
                "/top-students?academic_year=" . $a->first()->id .
                "&limit=4"
        );
        // Check the returned data
        $response->assertStatus(404);
    }



    public function test_teacher_gets_top_students_for_assigned_subject(): void
    {
        // Prepare the school context
        $user =  $this->createTeacherUser();
        $this->actingAs($user);

        $a = $this->createAcademicYears(2025, 2026);
        $subject = $this->createSubjects(1);
        $c = $this->createClasses(1);

        $teachingAssignment = $this->createTeachingContext(
            $user->teacher, // same teacher
            $a->first(),
            $c->first(),
            $subject->first()
        );

        // Create students and grades for this subject
        $students = $this->createStudentWithEnrollment(
            $a->first(),
            $c->first(),
            20
        );

        $this->createExamWithGrades(
            $students,
            $teachingAssignment
        );

        // Request only the top 4 students
        $response = $this->getJson(
            "/api/statistics/subjects/" . $subject->first()->id .
                "/top-students?academic_year=" . $a->first()->id .
                "&limit=3"
        );

        // Check the returned data
        $response->assertStatus(200);
        $response->assertJsonPath('subject.id', $subject->first()->id);
        $response->assertJsonIsArray('top_students');
        $response->assertJsonCount(3, 'top_students');

        $averages = collect($response->json('top_students'))
            ->pluck('average');

        // Averages should already be sorted from highest to lowest
        $this->assertEquals(
            $averages->sortDesc()->values()->all(),
            $averages->values()->all()
        );

        // Normalized averages must stay within 100
        $this->assertLessThanOrEqual(
            100,
            $averages->first()
        );
    }
}
