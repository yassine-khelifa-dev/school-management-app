<?php

namespace App\Queries;

use App\Models\Grade;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StatisticsQuery
{
    public function topStudents(
        Subject $subject,
        int $academicYear,
        ?int $schoolClass = null,
        ?Teacher $teacher = null,
        int $limit = 5,
    ): Collection {
        // GROUP BY student
        // AVG normalized score
        // ORDER BY average DESC
        // LIMIT

        return Subject::query()
            ->join(
                'teaching_assignments',
                'teaching_assignments.subject_id',
                '=',
                'subjects.id'
            )
            ->join(
                'exams',
                'exams.teaching_assignment_id',
                '=',
                'teaching_assignments.id'
            )
            ->join(
                'grades',
                'grades.exam_id',
                '=',
                'exams.id'
            )
            ->join(
                'students',
                'students.id',
                '=',
                'grades.student_id'
            )

            ->where('subjects.id', $subject->id)

            ->where(
                'teaching_assignments.academic_year_id',
                $academicYear
            )

            ->when($teacher, fn($q) => $q->where('teaching_assignments.teacher_id', $teacher->id))

            ->when(
                $schoolClass,
                fn($q) =>
                $q->where(
                    'teaching_assignments.class_id',
                    $schoolClass
                )
            )

            ->select(
                'students.id',
                'students.first_name',
                'students.last_name'
            )

            ->selectRaw(
                'AVG(
                (grades.score / NULLIF(exams.maximum_score, 0)) * 100
            ) as avg_total'
            )

            ->groupBy(
                'students.id',
                'students.first_name',
                'students.last_name'
            )
            ->orderByDesc('avg_total')
            ->limit($limit)
            ->get();
    }



    public function subjectsOverview(
        int $academicYear,
        ?int $schoolClass = null,
        ?Teacher $teacher = null,
        int $threshold = 50,
    ): Collection {
        // AVG, CASE, GROUP BY, pass_rate...

        return Grade::query()
            ->join('students', 'students.id', '=', 'grades.student_id')
            ->join('exams', 'exams.id', '=', 'grades.exam_id')
            ->join(
                'teaching_assignments',
                'teaching_assignments.id',
                '=',
                'exams.teaching_assignment_id'
            )
            ->join(
                'subjects',
                'subjects.id',
                '=',
                'teaching_assignments.subject_id'
            )

            ->where(
                'teaching_assignments.academic_year_id',
                $academicYear
            )

            ->when(
                $schoolClass,
                fn($q) =>
                $q->where(
                    'teaching_assignments.class_id',
                    $schoolClass
                )
            )

            ->when(
                $teacher,
                fn($q) =>
                $q->where(
                    'teaching_assignments.teacher_id',
                    $teacher->id
                )
            )

            ->select(
                'subjects.id',
                'subjects.name'
            )

            ->selectRaw(
                'AVG(
                (grades.score / NULLIF(exams.maximum_score, 0)) * 100
            ) as average'
            )

            ->selectRaw(
                'COUNT(DISTINCT students.id) as students_count'
            )

            ->selectRaw(
                'SUM(
                CASE
                    WHEN (
                        (grades.score / NULLIF(exams.maximum_score, 0)) * 100
                    ) >= ?
                    THEN 1
                    ELSE 0
                END
            ) as pass_count',
                [$threshold]
            )

            ->selectRaw(
                'SUM(
                CASE
                    WHEN (
                        (grades.score / NULLIF(exams.maximum_score, 0)) * 100
                    ) < ?
                    THEN 1
                    ELSE 0
                END
            ) as fail_count',
                [$threshold]
            )

            ->selectRaw(
                '(
                SUM(
                    CASE
                        WHEN (
                            (grades.score / NULLIF(exams.maximum_score, 0)) * 100
                        ) >= ?
                        THEN 1
                        ELSE 0
                    END
                )
                /
                NULLIF(COUNT(grades.id), 0)
            ) * 100 as pass_rate',
                [$threshold]
            )

            ->groupBy(
                'subjects.id',
                'subjects.name'
            )
            ->get();
    }


    public function globalAverage(
        int $academicYear,
        ?int $schoolClass = null,
        ?Teacher $teacher = null,
    ): ?float {
        return  Grade::query()
            ->forStatisticsScope($academicYear, $schoolClass, $teacher)
            ->join('exams', 'exams.id', '=', 'grades.exam_id')
            ->selectRaw('AVG((grades.score / NULLIF(exams.maximum_score, 0) ) * 100) as percentage ')
            ->value('percentage');
    }


    public function subjectPerformanceCounts(
        int $academicYear,
        ?int $schoolClass = null,
        ?Teacher $teacher = null,
        int $threshold = 50,
    ): array {

        $subjectAverages = Subject::query()
            ->join(
                'teaching_assignments',
                'teaching_assignments.subject_id',
                '=',
                'subjects.id'
            )
            ->join(
                'exams',
                'exams.teaching_assignment_id',
                '=',
                'teaching_assignments.id'
            )
            ->join(
                'grades',
                'grades.exam_id',
                '=',
                'exams.id'
            )

            ->where(
                'teaching_assignments.academic_year_id',
                $academicYear
            )

            ->when(
                $schoolClass,
                fn($q) =>
                $q->where(
                    'teaching_assignments.class_id',
                    $schoolClass
                )
            )

            ->when(
                $teacher,
                fn($q) =>
                $q->where(
                    'teaching_assignments.teacher_id',
                    $teacher->id
                )
            )

            ->select('subjects.id')

            ->selectRaw(
                'AVG(
                (grades.score / NULLIF(exams.maximum_score, 0)) * 100
            ) as avg_total'
            )

            ->groupBy('subjects.id');

        $result = DB::query()
            ->fromSub($subjectAverages, 'subject_averages')

            ->selectRaw(
                'SUM(CASE WHEN avg_total >= ? THEN 1 ELSE 0 END) as passing',
                [$threshold]
            )

            ->selectRaw(
                'SUM(CASE WHEN avg_total < ? THEN 1 ELSE 0 END) as failing',
                [$threshold]
            )

            ->first();

        return [
            'passing' => (int) ($result->passing ?? 0),
            'failing' => (int) ($result->failing ?? 0),
        ];
    }
}
