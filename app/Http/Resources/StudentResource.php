<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'full_name' => $this->full_name,
            'last_name' => $this->last_name,
            'first_name' => $this->first_name,
            'email' => $this->user->email,
            'phone' => $this->phone,
            "enrollments_count" => $this->enrollments_count,
            'enrollment' => $this->whenLoaded('enrollment', function () {
                return [
                    'id' => $this->enrollment->id,
                    'schoolClass' => new ClassResource(
                        $this->enrollment->schoolClass
                    ),
                    'academicYear' => new AcademicResource(
                        $this->enrollment->academicYear
                    ),
                    'status' => $this->enrollment->status,
                    'enrolled_at' => $this->enrollment->enrolled_at,
                ];
            }),
        ];
    }
}
