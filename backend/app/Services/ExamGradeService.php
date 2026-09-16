<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\Grade;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class ExamGradeService
{
    public function getEligibleStudentsWithGrades(Exam $exam)
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
            'grades' => fn($q_g) => $q_g->where('exam_id', $examID)
        ])
            ->whereHas('enrollments', fn($q_en) => $q_en->where('class_id', $schoolClassID)->where('academic_year_id', $academicYearID))
            ->get();

        return compact('exam', 'students');
    }


    public function saveGrades(Exam $exam, array $scores)
    {
        $exam->load([
            'teachingAssignment.schoolClass',
            'teachingAssignment.academicYear',
        ]);

        $schoolClassID = $exam->teachingAssignment->schoolClass->id;
        $academicYearID = $exam->teachingAssignment->academicYear->id;

        $students = Student::whereHas(
            'enrollments',
            fn($q_en) => $q_en->where('class_id', $schoolClassID)->where('academic_year_id', $academicYearID)
        )->get();

        DB::transaction(function () use ($exam, $scores, $students) {

            foreach ($scores as $key => $row) {
                $student_id = $row['student_id'];
                $score = $row['score'];

                /**
                 * selected exam's school class
                 * selected exam's academic year
                 */
                $checkStudent = $students->firstWhere('id', $student_id);

                if ($checkStudent === null) {
                    // not allow grading
                    abort(403, 'Student is not eligible for this exam.');
                }

                if ($score === null) {
                    // not yet grading
                    continue;
                }

                // update or write a new score

                Grade::updateOrCreate(
                    ['student_id' => $student_id, 'exam_id' => $exam->id],
                    ['score' => $score]
                );
            }
        });
    }
}
