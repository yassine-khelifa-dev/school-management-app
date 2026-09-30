<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'exam_id',
        'score',
        'comment',
        'graded_at',
    ];


    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'id');
    }


    public function scopeForStatisticsScope(
        Builder $query,
        int $academicYear,
        ?int $schoolClass = null
    ) {

        return $query->whereHas(
            'exam.teachingAssignment',
            fn($q) =>
            $q->where('academic_year_id', $academicYear)
                ->when($schoolClass,  fn($q) => $q->where('class_id', $schoolClass))
        );
    }


    public function scopeGlobalAverage(
        Builder $query,
        int $academicYear,
        ?int $schoolClass = null
    ) {

        return  $query->forStatisticsScope($academicYear, $schoolClass)
            ->join('exams', 'exams.id', '=', 'grades.exam_id')
            ->selectRaw('AVG((grades.score / NULLIF(exams.maximum_score, 0) ) * 100) as percentage ')
            ->value('percentage');
    }

    public function scopeGlobalAverageBySubject(
        Builder $query,
        int $academicYear,
        ?int $schoolClass = null,
        int $threshold = 50,
    ): Builder {
        return $query
            ->forStatisticsScope($academicYear, $schoolClass)

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
            );
    }
}
