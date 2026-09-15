<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Grade\GradeMangeRequest;
use App\Http\Resources\StudentGradeResource;
use App\Models\Exam;
use App\Models\Grade;
use DB;

class GradeConroller extends Controller
{
    public function index(Exam $exam)
    {
        $this->authorize('manageGrades', $exam);

        return $this->baseResponse($exam);
    }

    public function manage(GradeMangeRequest $request, Exam $exam)
    {
        $this->authorize('manageGrades', $exam);

        $data = $request->validated();

        // grades: [...[student_id, score]]
        $grades = collect($data['grades'])->values();


        $exam = DB::transaction(function () use ($exam, $grades) {

            $myStudents = $exam->getStudents();

            $myStudents->each(function ($student) use ($exam, $grades) {

                $exist = Grade::where('student_id', $student->id)
                    ->where('exam_id', $exam->id)
                    ->exists();

                // Grade doesn't exist.
                if (! $exist) {
                    // has graded ?
                    $score = $grades->firstWhere('student_id', $student->id)['score'] ?? null;

                    if (! $score) return true; // not yet graded
                    // create:
                    $exam->grades()->create([
                        'score' => $score,
                        'student_id' => $student->id,
                        'graded_at' => now(),
                    ]);
                }
                // Grade exists.
                else {
                    // exist ->check:update:
                    $score = $grades->firstWhere('student_id', $student->id)['score'] ?? null;
                    if (! $score) return true;  // keep the old value

                    // update :
                    $exam->grades()->where('student_id', $student->id)->update([
                        'score' => $score,
                        'graded_at' => now(),
                    ]);
                }
            });
            return $exam;
            // END: transaction
        });

        $exam->refresh();

        return $this->baseResponse($exam);
    }



    private function baseResponse(Exam $exam)
    {
        $exam->loadCount('grades');
        $students = $exam->getStudents();
        $students->load(['grades' => fn($q) => $q->where('exam_id', $exam->id)]);

        return response()->json([
            'data' => StudentGradeResource::collection($students),
            'meta' => [
                'maximum_score' => $exam->maximum_score,
                'grades_count' => $exam->grades_count,
                'students_count' => $students->count(),
            ],
        ], 200);
    }


    public function destroy(Exam $exam, Grade $grade)
    {
        $this->authorize('manageGrades', $exam);
        if ($grade->exam_id !== $exam->id) return response()->json([
            'message' => "This grande do not belong to this exam."
        ], 422);
        $grade->delete();
        return response()->noContent();
    }
}
