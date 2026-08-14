<?php

namespace App\Queries;

use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class TeacherClassPerformanceQuery
{
    public function build(array $filters, Teacher $teacher): Builder
    {
        $academicYearId =  $filters['academic_year'] ?? null;
        $subjectId =  $filters['subject'] ?? null;
        $schoolClassId =  $filters['school_class'] ?? null;
        $sort  =  $filters['q_field_sorted'] ?? null;
        $direction =  $filters['q_dir_sorted'] ?? 'desc';


        $query = Student::query()
            ->with([
                'user',
                'enrollments' => fn($q) =>
                $q->where('class_id', $schoolClassId)
                    ->where('academic_year_id', $academicYearId),
            ])
            ->whereHas(
                'grades.exam.teachingAssignment',
                fn($ta) =>
                $ta->forTeacherAssignmentContext(
                    $subjectId,
                    $teacher->id,
                    $academicYearId,
                    $schoolClassId
                )
            )
            ->whereHas(
                'enrollments',
                fn($q) =>
                $q->where('class_id', $schoolClassId)
                    ->where('academic_year_id', $academicYearId),
            )
            ->withCount([
                'grades as exams_count' => function ($query) use ($subjectId, $teacher, $academicYearId, $schoolClassId) {
                    $query->whereHas(
                        'exam.teachingAssignment',
                        fn($q) => $q->forTeacherAssignmentContext(
                            $subjectId,
                            $teacher->id,
                            $academicYearId,
                            $schoolClassId
                        )
                    );
                }
            ])
            ->withAvg([
                'grades as average_percentage' => function ($query) use ($subjectId, $teacher, $academicYearId, $schoolClassId) {
                    $query->whereHas(
                        'exam.teachingAssignment',
                        fn($q) => $q->forTeacherAssignmentContext(
                            $subjectId,
                            $teacher->id,
                            $academicYearId,
                            $schoolClassId
                        )
                    )
                        ->join('exams', 'exams.id', '=', 'grades.exam_id');
                }
            ], DB::raw('(grades.score / exams.maximum_score) * 100'))

            ->withMin([
                'grades' => function ($query) use ($subjectId, $teacher, $academicYearId, $schoolClassId) {
                    $query->whereHas(
                        'exam.teachingAssignment',
                        fn($q) => $q->forTeacherAssignmentContext(
                            $subjectId,
                            $teacher->id,
                            $academicYearId,
                            $schoolClassId
                        )
                    );
                }
            ], 'score')

            ->withMax([
                'grades' => function ($query) use ($subjectId, $teacher, $academicYearId, $schoolClassId) {
                    $query->whereHas(
                        'exam.teachingAssignment',
                        fn($q) => $q->forTeacherAssignmentContext(
                            $subjectId,
                            $teacher->id,
                            $academicYearId,
                            $schoolClassId
                        )
                    );
                }
            ], 'score');


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
