<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;

class StudentAcademicProfileController extends Controller
{
    public function show(Student $student)
    {
        $student->load([
            'user',
            'enrollments.schoolClass',
            'enrollments.academicYear'
        ]);

        $enrollments = $student->enrollments->sortByDesc(fn($en)  => $en->academicYear->starts_at)->values();

        $current_enroll = $enrollments?->first() ?? null;

        return view('students.academic-profile', compact('student', 'enrollments', 'current_enroll'));
    }

    public function grades(Student $student)
    {

        $student->load([
            'user',
            'grades.exam.teachingAssignment.schoolClass',
            'grades.exam.teachingAssignment.subject',
            'grades.exam.teachingAssignment.academicYear',
        ]);

        $grades = $student->grades->sortByDesc(fn($g) => $g->exam->exam_date);

        return view('students.grades', compact('student', 'grades'));
    }
}
