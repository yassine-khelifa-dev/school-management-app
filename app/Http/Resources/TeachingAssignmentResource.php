<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeachingAssignmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            ...((new TeachingAssignmentSummaryResource($this->resource))->toArray($request)),

            'teacher' =>  $this->whenLoaded('teacher', function () {
                return new TeacherResource($this->teacher);
            }),
            "schoolClass" =>   $this->whenLoaded('schoolClass', function () {
                return new ClassResource($this->schoolClass);
            }),
            "academicYear" =>  $this->whenLoaded('academicYear', function () {
                return new AcademicResource($this->academicYear);
            }),
            "subject" =>  $this->whenLoaded('subject', function () {
                return new SubjectResource($this->subject);
            }),
        ];
    }
}
