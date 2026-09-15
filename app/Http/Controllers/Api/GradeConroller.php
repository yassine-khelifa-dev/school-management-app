<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Grade\GradeMangeRequest;
use App\Http\Resources\StudentGradeResource;
use App\Models\Exam;
use App\Models\Grade;
use Carbon\Carbon;
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

        $grades = collect($data['grades'])
            ->filter(fn($row) => $row['score'] !== null)
            ->map(fn($r) =>  [
                ...$r,
                'graded_at' => Carbon::now()->toDateTimeString(),
                'exam_id' => $exam->id,
                'comment' => $r['comment'] ?? null,
            ])
            ->values();

        $exam->grades()->upsert(
            $grades->all(),
            uniqueBy: ['student_id', 'exam_id'],
            update: ['score', 'graded_at', 'comment']
        );


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
        ], 404);
        $grade->delete();
        return response()->noContent();
    }
}
