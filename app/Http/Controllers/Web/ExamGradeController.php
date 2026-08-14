<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamGradeStoreRequest;
use App\Models\Exam;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

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
            $students_grades->push([
                'student_id' =>  $student->id,
                'score' =>  $student->grades->first()?->score
            ]);
        }

        return view('exam-grades.index', compact('exam', 'students', 'students_grades'));
    }


    public function store(ExamGradeStoreRequest $request, Exam $exam)
    {
        $validatedScores = $request->validated();

        $exam->load([
            'teachingAssignment.schoolClass',
            'teachingAssignment.academicYear',
        ]);

        $schoolClassID = $exam->teachingAssignment->schoolClass->id;
        $academicYearID = $exam->teachingAssignment->academicYear->id;


        if (empty($validatedScores['scores'])) {
            return redirect()->route('exams-grades.index', $exam->id)
                ->with('warning', 'There are no grades to submite.');
        }

        foreach ($validatedScores['scores'] ?? [] as $key => $row) {
            $student_id = $row['student_id'];
            $score = $row['score'];

            $student = Student::where('id', $student_id)->firstOrFail();

            $student->load([
                'user',
                'enrollments.schoolClass',
                'enrollments.academicYear',
                'grades' => fn($q_g) => $q_g->where('exam_id', $exam->id)
            ]);

            /**
             * selected exam's school class
             * selected exam's academic year
             */
            $checkStudent = $student->enrollments()->where('class_id', $schoolClassID)->where('academic_year_id', $academicYearID)->exists();

            if ($checkStudent === false) {
                // not allow grading
                abort(403, 'Student is not eligible for this exam.');
            }

            if ($score === null) {
                // not yet grading
                continue;
            }

            // update or write a new score

            Grade::updateOrCreate(
                ['student_id' => $student->id, 'exam_id' => $exam->id],
                ['score' => $score]
            );
        }

        return redirect()->route('exams-grades.index', $exam->id)->with('success', 'Grades saved successfully.');
    }




    public function teacherGrades(Exam $exam)
    {

        Gate::authorize('manageGrades', $exam);


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
            $students_grades->push([
                'student_id' =>  $student->id,
                'score' =>  $student->grades->first()?->score
            ]);
        }

        return view('teacher.assigned-exams-grades', compact('exam', 'students', 'students_grades'));
    }

    public function storeTeacherGrades(ExamGradeStoreRequest $request, Exam $exam)
    {

        Gate::authorize('manageGrades', $exam);


        $validatedScores = $request->validated();


        $exam->load([
            'teachingAssignment.schoolClass',
            'teachingAssignment.academicYear',
        ]);

        $schoolClassID = $exam->teachingAssignment->schoolClass->id;
        $academicYearID = $exam->teachingAssignment->academicYear->id;

        foreach ($validatedScores['scores'] as $key => $row) {
            $student_id = $row['student_id'];
            $score = $row['score'];

            $student = Student::where('id', $student_id)->firstOrFail();

            $student->load([
                'user',
                'enrollments.schoolClass',
                'enrollments.academicYear',
                'grades' => fn($q_g) => $q_g->where('exam_id', $exam->id)
            ]);

            /**
             * selected exam's school class
             * selected exam's academic year
             */
            $checkStudent = $student->enrollments()->where('class_id', $schoolClassID)->where('academic_year_id', $academicYearID)->exists();

            if ($checkStudent === false) {
                // not allow grading
                abort(403, 'Student is not eligible for this exam.');
            }

            if ($score === null) {
                // not yet grading
                continue;
            }

            // update or write a new score

            Grade::updateOrCreate(
                ['student_id' => $student->id, 'exam_id' => $exam->id],
                ['score' => $score]
            );
        }

        return redirect()->route('teacher.assigned-exams.grades', $exam->id)->with('success', 'Grades saved successfully.');
    }
}
