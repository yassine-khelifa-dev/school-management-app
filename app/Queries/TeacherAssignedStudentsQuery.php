<?php

namespace App\Queries;

use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Builder;

class TeacherAssignedStudentsQuery
{
    public function build(array $filters, Teacher $teacher): Builder
    {

        $academicYear = $filters['academic_year'] ?? null;
        $schoolClass = $filters['school_class'] ?? null;

        $query = Student::query()
            ->with('user')
            ->withWhereHas('enrollments', function ($enrollment) use ($teacher) {
                $enrollment
                    ->whereExists(function ($q) use ($teacher) {
                        $q->selectRaw('1')
                            ->from('teaching_assignments')
                            ->where('teaching_assignments.teacher_id', $teacher->id)
                            ->whereColumn(
                                'teaching_assignments.academic_year_id',
                                'enrollments.academic_year_id'
                            )
                            ->whereColumn(
                                'teaching_assignments.class_id',
                                'enrollments.class_id'
                            );
                    })
                    ->with([
                        'schoolClass',
                        'academicYear',
                    ]);
            })
            ->when(
                $academicYear,
                fn($q) => $q->whereHas('enrollments', fn($en) => $en->where('academic_year_id', $academicYear))
            )
            ->when(
                $schoolClass,
                fn($q) => $q->whereHas('enrollments', fn($en) => $en->where('class_id', $schoolClass))
            );

        return $query;
    }
}
