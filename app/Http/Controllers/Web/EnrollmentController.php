<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnrollmentIndexRequest;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Queries\EnrollmentIndexQuery;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(EnrollmentIndexRequest $request, EnrollmentIndexQuery $enrollmentIndexQuery)
    {
        // check form's inputs:
        $data = $request->validated();
        $enrollments = $enrollmentIndexQuery
            ->build($data)
            ->paginate(20)
            ->withQueryString();

        $academicYears = AcademicYear::latest('starts_at')->get();
        $schoolClasses = SchoolClass::orderBy('name', 'asc')->get();

        return view('enrollments.index', compact('enrollments', 'academicYears', 'schoolClasses'));
    }
}
