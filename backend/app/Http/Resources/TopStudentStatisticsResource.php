<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TopStudentStatisticsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'student_id' => $this->id,
            'full_name' => $this->first_name . ' ' . $this->last_name,
            'average' => round((float) $this->avg_total, 2),
        ];
    }
}
