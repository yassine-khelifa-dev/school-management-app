<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\EnrollmentStoreRequest;
use App\Http\Requests\Api\EnrollmentUpdateRequest;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use Exception;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $status = strtolower($request->input('status')) ?? null;
        $search = strtolower($request->input('search')) ?? null;
        $academicYear = $request->input('academicYearSelected') ?? null;
        $schoolClass = $request->input('schoolClassesSelected') ?? null;


        if (
            $status !== "active"
            && $status !== "cancelled"
            && $status !== "completed"
        ) $status = null;

        $query = Enrollment::query()->with([
            'student.user',
            'academicYear',
            'schoolClass'
        ])
            ->when($status, fn($q) =>  $q->where("status", $status))

            ->when($academicYear, fn($q) => $q->where('academic_year_id', $academicYear))
            ->when($schoolClass, fn($q) => $q->where('class_id', $schoolClass))

            ->when($search, fn($q) => $q->whereHas("student.user", function ($qst) use ($search) {
                $qst->where('first_name', 'like', "$search%")
                    ->orWhere('last_name', 'like', "$search%");
            }));


        $enrlls =  $query->orderBy('enrolled_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return EnrollmentResource::collection($enrlls);
    }

    public function store(EnrollmentStoreRequest $request)
    {
        $data = $request->validated();

        $enrollment = Enrollment::create($data);

        return response()->json([
            'data' => $enrollment,
        ], 201);
    }

    public function update(EnrollmentUpdateRequest $request, Enrollment $enrollment)
    {
        $data = $request->validated();

        $enrollment->load(['student.user']);

        // todo: middleware:
        if (auth()->user()->role !== 'admin') return response()->json([
            'message' => "you aren't auto to run this actions"
        ], 403);

        try {
            $enrollment->update($data);
        } catch (Exception $err) {
            return response()->json([
                'message' =>  $err->getMessage()
            ], 403);
        }
        $enrollment->refresh();

        return response()->json([
            'data' => $enrollment,
        ], 200);
    }


    public function destroy(Enrollment $enrollment)
    {

        $enrollment->delete();

        return response()->noContent();
    }
}
