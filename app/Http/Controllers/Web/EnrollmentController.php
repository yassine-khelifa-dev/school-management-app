<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Enrollment;
use App\Models\SchoolClass;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Enrollment::query()->with([
            'student',
            'academicYear',
            'schoolClass'
        ])
            ->when(
                $request->filled('q_student_full_name'),
                fn($q) =>
                $q->whereHas(
                    'student',
                    fn($qstud) => $qstud
                        ->where('first_name', 'like', '%' . $request->input('q_student_full_name') . '%')
                        ->orWhere('last_name', 'like', '%' . $request->input('q_student_full_name') . '%')
                )
            )
            ->when(
                $request->filled('q_status'),
                fn($q) => $q->where('status', 'active')
            )
            ->when(
                $request->filled('q_academic_year'),
                function ($q) use ($request) {
                    return $q->where('academic_year_id', $request->input('q_academic_year'));
                }
            )
            ->when(
                $request->filled('q_school_class'),
                function ($q) use ($request) {
                    return $q->where('class_id', $request->input('q_school_class'));
                }
            );



        $academicYears = AcademicYear::latest('starts_at')->get();
        $schoolClasses = SchoolClass::orderBy('name', 'asc')->get();


        $enrollments = $query->paginate(20)->withQueryString();

        return view('enrollments.index', compact('enrollments', 'academicYears', 'schoolClasses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
