<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
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
            'title' => $this->title,
            'exam_date' =>  date('Y-m-d', strtotime($this->exam_date)),
            'maximum_score' => $this->maximum_score,
            'teaching_assignment_id' => $this->teaching_assignment_id,
            'teacher' =>  $this->whenLoaded('teachingAssignment', function () {
                return new TeacherResource($this->teachingAssignment->teacher);
            }),
            "schoolClass" =>   $this->whenLoaded('teachingAssignment', function () {
                return new ClassResource($this->teachingAssignment->schoolClass);
            }),
            "academicYear" =>  $this->whenLoaded('teachingAssignment', function () {
                return new AcademicResource($this->teachingAssignment->academicYear);
            }),
            "subject" =>  $this->whenLoaded('teachingAssignment', function () {
                return new SubjectResource($this->teachingAssignment->subject);
            }),
            'grades_count' => $this->grades_count,
        ];
    }
}
