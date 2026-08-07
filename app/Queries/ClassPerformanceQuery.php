<?php

namespace App\Queries;

use App\Models\Student;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ClassPerformanceQuery
{
    public function build(array $filters): Builder
    {
        $academic_year =  $filters['academic_year'] ?? null;
        $subject =  $filters['subject'] ?? null;
        $school_classe =  $filters['school_class'] ?? null;
        $sort  =  $filters['q_field_sorted'] ?? null;
        $direction =  $filters['q_dir_sorted'] ?? 'desc';



        $query = Student::query()
            ->with([
                'user',

                'grades' => function ($gradeQuery) use ($subject) {
                    $gradeQuery->whereHas(
                        'exam.teachingAssignment.subject',
                        fn($subjectQuery) =>
                        $subjectQuery->where('id', $subject)
                    );
                },

                'grades.exam.teachingAssignment.subject' => fn($q) =>
                $q->where('id', $subject),

                'enrollments' => fn($q) =>
                $q->where('class_id', $school_classe)
                    ->where('academic_year_id', $academic_year),
            ])

            ->when(
                $academic_year,
                fn($q) => $q->whereHas('enrollments', function ($q_enrollments) use ($academic_year) {
                    $q_enrollments->where('academic_year_id', $academic_year);
                })
            )
            ->when(
                $subject,
                fn($q) => $q->whereHas('grades.exam.teachingAssignment.subject', function ($q_subject) use ($subject) {
                    $q_subject->where('id', $subject);
                })
            )
            ->when(
                $school_classe,
                fn($q) => $q->whereHas('enrollments', function ($q_school_classe) use ($school_classe) {
                    $q_school_classe->where('class_id', $school_classe);
                })
            )
            ->withCount([
                'grades as exams_count' => function ($query) use ($subject) {
                    $query->whereHas(
                        'exam.teachingAssignment.subject',
                        fn($q) => $q->where('id', $subject)
                    );
                }
            ])
            ->withMin([
                'grades' => function ($query) use ($subject) {
                    $query->whereHas(
                        'exam.teachingAssignment.subject',
                        fn($q) => $q->where('id', $subject)
                    );
                }
            ], 'score')

            ->withMax([
                'grades' => function ($query) use ($subject) {
                    $query->whereHas(
                        'exam.teachingAssignment.subject',
                        fn($q) => $q->where('id', $subject)
                    );
                }
            ], 'score')

            ->withAvg([
                'grades as average_percentage' => function ($query) use ($subject) {
                    $query->whereHas(
                        'exam.teachingAssignment.subject',
                        fn($q) => $q->where('id', $subject)
                    )
                        ->join('exams', 'exams.id', '=', 'grades.exam_id');
                }
            ], DB::raw('(grades.score / exams.maximum_score) * 100'));



        match ($sort) {
            'average_percentage' => $query->orderBy('average_percentage', $direction),

            'first_name' => $query->orderBy('first_name',  $direction),

            'last_name' => $query->orderBy('last_name',  $direction),

            'exams_count' => $query->orderBy('exams_count', $direction),
            default => $query->orderBy('id', $direction)
        };

        return $query;
    }
}
