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
        $this->actingAs($this->createAdminUser());
        $a = $this->createAcademicYears(2025, 2026);
        $subject = $this->createSubjects(1);
        $c = $this->createClasses(1);

        $this->createTeachingContext(
            $this->createTeacherUser()->teacher,
            $a->first(),
            $c->first(),
            $subject->first()
        );

        $response = $this->getJson("/api/statistics/subjects/" . ($subject->first()->id) .
            "/top-students?academic_year=" . $a->first()->id);

        $response->assertStatus(200);
        $response->assertJsonPath('subject.id', $subject->first()->id);
        $response->assertJsonIsArray('top_students');
    }

    public function test_top_students_endpoint_returns_subject_and_students_array()
    {
        $this->actingAs($this->createAdminUser());
        $a = $this->createAcademicYears(2025, 2026);
        $subject = $this->createSubjects(1);
        $c = $this->createClasses(1);

        $teaching_assignment = $this->createTeachingContext(
            $this->createTeacherUser()->teacher,
            $a->first(),
            $c->first(),
            $subject->first()
        );

        $students = $this->createStudentWithEnrollment($a->first(), $c->first(), 15);
        $this->createExamWithGrades($students, $teaching_assignment);


        $response = $this->getJson("/api/statistics/subjects/" . ($subject->first()->id) .
            "/top-students?academic_year=" . $a->first()->id . "&limit=4");

        $response->assertStatus(200);
        $response->assertJsonPath('subject.id', $subject->first()->id);
        $response->assertJsonIsArray('top_students');
        $response->assertJsonCount(4, 'top_students');

        $averages = collect($response->json('top_students'))
            ->pluck('average');

        $this->assertEquals(
            $averages->sortDesc()->values()->all(),
            $averages->values()->all()
        );
        $this->assertLessThanOrEqual(
            100,
            $averages->first()
        );
    }
}
