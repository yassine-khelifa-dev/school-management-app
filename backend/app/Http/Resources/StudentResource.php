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

            ...((new StudentSummaryResource($this->resource))->toArray($request)),

            "enrollments_count" => $this->enrollments_count,
            'enrollment' => $this->whenLoaded('currentEnrollment', function () {
                return [
                    'id' => $this->currentEnrollment->id,
                    'schoolClass' => new ClassResource(
                        $this->currentEnrollment->schoolClass
                    ),
                    'academicYear' => new AcademicResource(
                        $this->currentEnrollment->academicYear
                    ),
                    'status' => $this->currentEnrollment->status,
                    'enrolled_at' => $this->currentEnrollment->enrolled_at,
                ];
            }),
        ];
    }
}
