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
            "class_id" =>  new ClassResource($this->schoolClass),
            "student" =>  new StudentResource($this->student),

            "academic_year_id" =>  new AcademicResource($this->academicYear),

            "status" => $this->status
        ];
    }
}
