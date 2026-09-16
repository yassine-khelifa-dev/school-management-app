<?php

namespace Database\Factories;

use App\Models\Exam;
use App\Models\TeachingAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Exam>
 */
class ExamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'teaching_assignment_id' => TeachingAssignment::factory(),
            'title' => fake()->words(2, true),
            'exam_date' => fake()->dateTimeBetween(
                '2010-01-01',
                '2026-12-31'
            ),
            'maximum_score' => 100,
        ];
    }
}
