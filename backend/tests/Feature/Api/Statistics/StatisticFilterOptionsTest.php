<?php

namespace Tests\Feature\Api\Statistics;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesSchoolTestData;
use Tests\TestCase;

class StatisticFilterOptionsTest extends TestCase
{
    use RefreshDatabase, CreatesSchoolTestData;


    // =========================================================================================================
    // =========================================     ADMIN     ===============================================
    // =========================================================================================================

    public function test_statistics_filter_endpoint_done_admin(): void
    {
        $this->actingAs($this->createAdminUser());
        $response = $this->getJson('/api/statistics/filter-options');
        $response->assertStatus(200);
    }

    public function test_admin_gets_all_filter_options(): void
    {
        // craate :filter data
        $this->createAcademicYears(2023, 2026);
        $this->createSubjects(10);
        $this->createClasses(10);

        $this->actingAs($this->createAdminUser());
        $response = $this->getJson('/api/statistics/filter-options');
        $response->assertStatus(200);

        $response->assertJsonCount(4, 'academic_years');
        $response->assertJsonCount(10, 'classes');
        $response->assertJsonCount(10, 'subjects');
    }


    // =========================================================================================================
    // =========================================     TEACHER     ===============================================
    // =========================================================================================================

    public function test_statistics_filter_endpoint_done_teacher(): void
    {
        $this->actingAs($this->createTeacherUser());
        $response = $this->getJson('/api/statistics/filter-options');
        $response->assertStatus(200);
    }

    public function test_teacher_without_assignments_gets_empty_filter_options(): void
    {
        // craate :filter data
        $this->createAcademicYears(2023, 2026);
        $this->createSubjects(10);
        $this->createClasses(10);

        $this->actingAs($this->createTeacherUser());
        $response = $this->getJson('/api/statistics/filter-options');
        $response->assertStatus(200);

        $response->assertJsonCount(0, 'academic_years');
        $response->assertJsonCount(0, 'classes');
        $response->assertJsonCount(0, 'subjects');
    }

    public function test_teacher_with_assignments_gets_filter_options(): void
    {
        // craate :filter data
        $userTeacher =  $this->createTeacherUser();
        $a = $this->createAcademicYears(2023, 2026);
        $s = $this->createSubjects(10);
        $c = $this->createClasses(10);

        $this->createTeachingContext($userTeacher->teacher, $a->first(), $c->first(), $s->first());


        $this->actingAs($userTeacher);
        $response = $this->getJson('/api/statistics/filter-options');
        $response->assertStatus(200);

        $response->assertJsonCount(1, 'academic_years');
        $response->assertJsonCount(1, 'classes');
        $response->assertJsonCount(1, 'subjects');


        $response->assertJsonPath('subjects.0.id', $s->first()->id);
    }
}
