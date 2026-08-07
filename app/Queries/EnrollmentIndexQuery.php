<?php
namespace App\Queries;

use App\Models\Enrollment;
use Illuminate\Database\Eloquent\Builder;

class EnrollmentIndexQuery
{
    public function build(array $filters): Builder
    {
        $studentFullName   = $filters['q_student_full_name'] ?? null;
        $status            = $filters['q_status']           ?? null;
        $academicYear      = $filters['q_academic_year']    ?? null;
        $schoolClass       = $filters['q_school_class']     ?? null;
        $sort              = $filters['q_field_sorted']     ?? 'enrolled_at';
        $direction         = $filters['q_dir_sorted']       ?? 'desc';

        $query = Enrollment::query()->with([
            'student.user',
            'academicYear',
            'schoolClass'
        ])
            ->when(
                $studentFullName,
                function ($query) use ($studentFullName) {
                    $name = trim($studentFullName);

                    $query->whereHas('student', function ($studentQuery) use ($name) {
                        $studentQuery->where(function ($query) use ($name) {
                            $query->where('first_name', 'like', "%{$name}%")
                                ->orWhere('last_name', 'like', "%{$name}%")
                                ->orWhereRaw(
                                    "CONCAT(first_name, ' ', last_name) LIKE ?",
                                    ["%{$name}%"]
                                );
                        });
                    });
                }
            )
            ->when(
                $status,
                fn($q) => $q->where('status',  $status)
            )
            ->when(
                $academicYear,
                fn($q) => $q->where('academic_year_id', $academicYear)
            )
            ->when(
                $schoolClass,
                fn($q) =>  $q->where('class_id', $schoolClass)
            );


        match ($sort) {
            'enrollment_id' => $query
                ->orderBy('enrollments.id', $direction),

            'first_name' => $query->join('students', 'students.id', '=', 'enrollments.student_id')
                ->select('enrollments.*')
                ->orderBy('students.first_name',  $direction),

            'last_name' => $query->join('students', 'students.id', '=', 'enrollments.student_id')
                ->select('enrollments.*')
                ->orderBy('students.last_name',  $direction),

            'class_name' => $query->join('classes', 'classes.id', '=', 'enrollments.class_id')
                ->select('enrollments.*')
                ->orderBy('classes.name', $direction),

            default =>  $query->orderBy('enrollments.enrolled_at', $direction),
        };


        return $query;
    }
}
