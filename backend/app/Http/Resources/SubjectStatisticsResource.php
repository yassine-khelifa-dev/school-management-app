<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectStatisticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "students_count" => (int) $this->students_count,
            "average" => round((float) $this->average, 2),
            "graded_records_count" => (int) $this->graded_records_count,
            "pass_count" => (int) $this->pass_count,
            "fail_count" => (int) $this->fail_count,
            "pass_rate" => round((float) $this->pass_rate, 2),
        ];
    }
}
