<?php

namespace App\Queries;

use App\Models\Exam;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Builder;


class TeacherAssignedExamsQuery
{
    public function build(array $filters, Teacher $teacher): Builder
    {

        $academicYear =  $filters['academic_year'] ?? null;
        $subject =  $filters['subject'] ?? null;
        $schoolClasse =  $filters['school_class'] ?? null;
        $sort  =  $filters['q_field_sorted'] ?? null;
        $direction =  $filters['q_dir_sorted'] ?? 'desc';

        $query = Exam::query()
            ->with([
                'teachingAssignment',
                'teachingAssignment.schoolClass',
                'teachingAssignment.subject',
                'teachingAssignment.academicYear',
            ])
            ->wherehas('teachingAssignment', fn($ta) => $ta->where('teacher_id', $teacher->id))
            ->when(
                $academicYear,
                function ($q_exam) use ($academicYear) {
                    $q_exam->whereHas('teachingAssignment', function ($q_ta) use ($academicYear) {
                        $q_ta->where('academic_year_id', $academicYear);
                    });
                }
            )
            ->when(
                $subject,
                function ($q_exam) use ($subject) {
                    $q_exam->whereHas('teachingAssignment', function ($q_ta) use ($subject) {
                        $q_ta->where('subject_id', $subject);
                    });
                }
            )
            ->when(
                $schoolClasse,
                function ($q_exam) use ($schoolClasse) {
                    $q_exam->wherehas('teachingAssignment', function ($q_ta) use ($schoolClasse) {
                        $q_ta->where('class_id', $schoolClasse);
                    });
                }
            );

        match ($sort) {
            'title_exam' => $query->orderBy('title', $direction),
            'exam_date' => $query->orderBy('exam_date', $direction),
            default => $query->orderBy('exams.id', $direction),
        };

        return $query;
    }
}
