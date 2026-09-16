<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
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
            "schoolClass" =>  new ClassResource($this->schoolClass),
            "student" =>  new StudentSummaryResource($this->whenLoaded('student')),

            "academicYear" =>  new AcademicResource($this->academicYear),

            "status" => $this->status,
            "enrolled_at" => $this->enrolled_at
        ];
    }
}
