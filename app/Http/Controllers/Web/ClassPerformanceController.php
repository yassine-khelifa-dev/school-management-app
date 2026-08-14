<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClassPerformanceRequest;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Queries\ClassPerformanceQuery;

class ClassPerformanceController extends Controller
{
    public function index(ClassPerformanceRequest $request, ClassPerformanceQuery $classPerformanceQuery)
    {
        $filters = $request->validated();

        $academic_years = AcademicYear::latest('starts_at')->get();
        $subjects = Subject::orderBy('name', 'asc')->get();
        $school_classes = SchoolClass::orderBy('name', 'asc')->get();
        $students = [];

        $query = $classPerformanceQuery->build($filters);

        $allStudents = (clone $query)->get();

        $stats = [
            'students_count'   => $allStudents->count(),
            'class_average'    => $allStudents->avg('average_percentage'),
            'highest_average'  => $allStudents->max('average_percentage'),
            'lowest_average'   => $allStudents->min('average_percentage'),
            'total_exams'      => $allStudents->max('exams_count'),
        ];

        $students = $query
            ->paginate(25)
            ->withQueryString();

        return view('class-performance.index', compact(
            'students',
            'academic_years',
            'subjects',
            'school_classes',
            'stats'
        ));
    }
}
