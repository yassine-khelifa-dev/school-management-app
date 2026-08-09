<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Student;

class ExamGradeController extends Controller
{
    public function index(Exam $exam)
    {

        $exam->load([
            'teachingAssignment.schoolClass',
            'teachingAssignment.subject',
            'teachingAssignment.academicYear',
            'teachingAssignment.teacher',

        ]);

        $examID = $exam->id;
        $schoolClassID = $exam->teachingAssignment->schoolClass->id;
        $academicYearID = $exam->teachingAssignment->academicYear->id;

        $students = Student::with([
            'user',
            'enrollments',
            'grades' => fn($q_g) => $q_g->where('exam_id', $examID)
        ])
            ->whereHas('enrollments', fn($q_en) => $q_en->where('class_id', $schoolClassID)->where('academic_year_id', $academicYearID))
            ->get();

        $students_grades = collect();
        foreach ($students as $student) {
            $students_grades->put(
                $student->id,
                $student->grades->first()?->score
            );
        }
        return view('exam-grades.index', compact('exam', 'students', 'students_grades'));
    }
}
