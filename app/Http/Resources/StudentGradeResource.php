<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentGradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $grade = $this->grades->first();

        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'last_name' => $this->last_name,
            'first_name' => $this->first_name,
            'grade' => [
                'id' => $grade?->id,
                'score' => $grade?->score,
                'graded_at' => $grade?->graded_at,
            ]
        ];
    }
}
