<?php

namespace Tests\Feature\Api\Statistics;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CreatesSchoolTestData;
use Tests\TestCase;

class OverviewTest extends TestCase
{
    use RefreshDatabase, CreatesSchoolTestData;
    public function test_statistics_overview_endpoint_done(): void
    {
        // Admin:
        $this->actingAs($this->createAdminUser());
        $a = $this->createAcademicYears(2025, 2026);

        $response = $this->get("/api/statistics/overview?academic_year=" . $a->first()->id);
        $response->assertStatus(200);
        $response->assertJsonCount(6, 'summary');
        $response->assertJsonCount(0, 'subjects');


        // Teacher:
        $this->actingAs($this->createTeacherUser());

        $response = $this->get("/api/statistics/overview?academic_year=" . $a->first()->id);
        $response->assertStatus(200);
        $response->assertJsonCount(6, 'summary');
        $response->assertJsonCount(0, 'subjects');
    }
}
