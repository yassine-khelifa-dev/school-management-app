<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $status = strtolower($request->input('status')) ?? null;
        $academicYear = strtolower($request->input('academicYearSelected')) ?? null;
        $schoolClass = strtolower($request->input('schoolClassesSelected')) ?? null;


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
            ->when($schoolClass, fn($q) => $q->where('class_id', $schoolClass));


        $enrlls =  $query->paginate(10)
            ->withQueryString();

        return EnrollmentResource::collection($enrlls);
    }
}
