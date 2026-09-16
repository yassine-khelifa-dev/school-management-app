<?php

namespace Database\Factories;

use App\Models\Grade;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Grade>
 */
class GradeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'score' => fake()->numberBetween(0, 100),
            'comment' => fake()->sentence(),
            'graded_at' => fake()->dateTimeBetween(
                '2010-01-01',
                '2026-12-31'
            ),
        ];
    }
}
