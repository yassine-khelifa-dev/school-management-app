<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use InvalidArgumentException;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function teachingAssignments()
    {
        return $this->hasMany(TeachingAssignment::class, 'subject_id', 'id');
    }



    public function scopeForAcademicYear(
        Builder $query,
        int $academicYear,
        ?int $schoolClass = null,

    ): Builder {

        return $query->whereHas(
            'teachingAssignments',
            fn($q) =>
            $q->where('academic_year_id', $academicYear)
                ->when(
                    $schoolClass,
                    fn($q) => $q->where('class_id', $schoolClass)
                )
        );
    }

    public function scopeWithAverageComparison(
        Builder $query,
        int $academicYear,
        ?int $schoolClass = null,

        int $threshold = 50,
        string $op = '>'
    ): Builder {

        $allowedOperators = ['>', '<', '>=', '<='];

        if (! in_array($op, $allowedOperators, true)) {
            throw new InvalidArgumentException('Invalid operator');
        }
        return $query

            ->join('teaching_assignments', 'teaching_assignments.subject_id', '=', 'subjects.id')
            ->join('exams', 'exams.teaching_assignment_id', '=', 'teaching_assignments.id')
            ->join('grades', 'grades.exam_id', '=', 'exams.id')

            ->where('teaching_assignments.academic_year_id', '=', $academicYear)
            ->when(
                $schoolClass,
                fn($q) => $q->where('teaching_assignments.class_id', $schoolClass)
            )

            ->select('subjects.id', 'subjects.name')
            ->selectRaw('AVG((grades.score / NULLIF(exams.maximum_score, 0) ) * 100) as avg_total')
            ->groupBy('subjects.id', 'subjects.name')
            ->havingRaw("avg_total {$op} ?", [$threshold]);
    }


    public function scopeTopStudents(
        Builder $query,
        int $academicYear,
        ?int $schoolClass = null,
        int $limit = 5,
    ): Builder {
        return $query
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

            ->limit($limit);
    }
}
