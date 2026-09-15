<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'score' => $this->score,
            'graded_at' => date('Y-m-d', strtotime($this->graded_at)),
            "student" =>  new StudentSummaryResource($this->whenLoaded('student')),
        ];
    }
}
