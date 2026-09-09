<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\ExamStoreRequest;
use App\Http\Requests\Exam\ExamUpdateRequest;
use App\Http\Requests\ExamIndexRequest;
use App\Http\Resources\ExamResource;
use App\Models\Exam;
use App\Models\Teacher;
use App\Queries\ExamIndexQuery;
use Exception;
use Illuminate\Support\Facades\Auth;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ExamIndexRequest $request, ExamIndexQuery $query)
    {
        $this->authorize('viewAny', Exam::class);

        $user = Auth::user();

        switch ($user->role) {

            case RoleEnum::ADMIN->value:
                return $this->getExamsForAdmin($request, $query);
            case  RoleEnum::TEACHER->value: {
                    // check Teacher :
                    $teacher = $user->teacher;
                    if (! $teacher) abort(403);
                    return $this->getExamsForTeacher($request, $query, $teacher);
                }
            default:
                abort(403);
        }
    }


    public function getExamsForAdmin(ExamIndexRequest $request, ExamIndexQuery $query)
    {
        $exams = $query->buildForAdmin($request->validated())
            ->paginate(10)
            ->withQueryString();

        return ExamResource::collection($exams);
    }

    public function getExamsForTeacher(ExamIndexRequest $request, ExamIndexQuery $query, Teacher $teacher)
    {
        $exams = $query->buildForTeacher($request->validated(), $teacher)
            ->paginate(10)
            ->withQueryString();

        return ExamResource::collection($exams);
    }


    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        $this->authorize('view', $exam);

        $exam->load([
            'teachingAssignment.schoolClass',
            'teachingAssignment.subject',
            'teachingAssignment.academicYear',
            'teachingAssignment.teacher.user',
        ])
            ->loadCount('grades');
        return new ExamResource($exam);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(ExamStoreRequest $request)
    {
        $this->authorize('create', Exam::class);

        $data = $request->validated();

        $exam = Exam::create($data);


        $exam->load([
            'teachingAssignment.schoolClass',
            'teachingAssignment.subject',
            'teachingAssignment.academicYear',
            'teachingAssignment.teacher.user',
        ])
            ->loadCount('grades');

        return response()->json([
            "data" => new ExamResource($exam)
        ], 201);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(ExamUpdateRequest $request, Exam $exam)
    {
        $this->authorize('update', $exam);

        $data = $request->validated();

        $exam->update($data);

        $exam->refresh();

        $exam->load([
            'teachingAssignment.schoolClass',
            'teachingAssignment.subject',
            'teachingAssignment.academicYear',
            'teachingAssignment.teacher.user',
        ])
            ->loadCount('grades');

        return response()->json([
            "data" => new ExamResource($exam)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        $this->authorize('delete', $exam);

        if ($exam->grades()->exists()) {
            return response()->json([
                'message' => "This Exam has grades, You can not delete it."
            ], 422);
        }

        $exam->delete();

        return response()->noContent();
    }
}
