<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;

class StudentAcademicProfileController extends Controller
{
    public function show(Student $student)
    {
        $student->load([
            'enrollments.schoolClass',
            'enrollments.academicYear'
        ]);

        $enrollments = $student->enrollments->sortByDesc(fn($en)  => $en->academicYear->starts_at)->values();

        return view('students.academic-profile', compact('student', 'enrollments'));
    }
}
