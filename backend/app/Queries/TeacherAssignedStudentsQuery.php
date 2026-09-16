<?php

namespace App\Queries;

use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Builder;

class TeacherAssignedStudentsQuery
{
    public function build(
        array $filters,
        Teacher $teacher
    ): Builder {
        return Student::query()
            ->assignedToTeacher(
                $teacher,
                $filters['academic_year'] ?? null,
                $filters['school_class'] ?? null,
                $filters['fullname'] ?? null,
            );
    }
}
