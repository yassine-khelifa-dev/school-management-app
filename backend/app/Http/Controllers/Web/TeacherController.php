<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\TeacherClassPerformanceRequest;
use App\Http\Requests\TeacherMyStudentsRequest;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Queries\TeacherAssignedStudentsQuery;
use App\Queries\TeacherClassPerformanceQuery;
use Illuminate\Support\Facades\Auth;

class TeacherController extends Controller
{
    public function students(TeacherMyStudentsRequest $request, TeacherAssignedStudentsQuery $teacherAssignedStudentsQuery)
    {
        $teacher = Auth::user()->teacher()->firstOrFail();

        $filters = $request->validated();

        $students = $teacherAssignedStudentsQuery->build($filters, $teacher)->paginate(10);

        $academic_years = AcademicYear::with(['teachingAssignments'])
            ->whereHas(
                'teachingAssignments',
                fn($ta) => $ta->where('teacher_id', $teacher->id)
            )
            ->orderBy('starts_at', 'desc')
            ->get();


        $school_classes = SchoolClass::with(['teachingAssignments'])
            ->whereHas(
                'teachingAssignments',
                fn($ta) => $ta->where('teacher_id', $teacher->id)
            )
            ->orderBy('name', 'asc')
            ->get();

        return view('teacher.students.index', compact('students', 'academic_years', 'school_classes'));
    }



    public function classPerformance(
        TeacherClassPerformanceRequest $request,
        TeacherClassPerformanceQuery $teacherAssignedStudentsQuery
    ) {
        $teacher = Auth::user()->teacher()->firstOrFail();

        $filters = $request->validated();


        $students = [];

        $query = $teacherAssignedStudentsQuery->build($filters, $teacher);

        $allStudents = (clone $query)->get();

        $stats = [
            'students_count'   => $allStudents->count(),
            'class_average'    => $allStudents->avg('average_percentage'),
            'highest_average'  => $allStudents->max('average_percentage'),
            'lowest_average'   => $allStudents->min('average_percentage'),
            'total_exam_attempts'      => $allStudents->sum('exams_count'),
        ];

        $students = $query
            ->paginate(25)
            ->withQueryString();

        $academic_years = AcademicYear::with(['teachingAssignments'])
            ->whereHas(
                'teachingAssignments',
                fn($ta) => $ta->where('teacher_id', $teacher->id)
            )
            ->orderBy('starts_at', 'desc')
            ->get();


        $school_classes = SchoolClass::with(['teachingAssignments'])
            ->whereHas(
                'teachingAssignments',
                fn($ta) => $ta->where('teacher_id', $teacher->id)
            )
            ->orderBy('name', 'asc')
            ->get();

        $subjects = Subject::with('teachingAssignments')
            ->whereHas(
                'teachingAssignments',
                fn($ta) => $ta->where('teacher_id', $teacher->id)
            )->orderBy('name', 'asc')->get();



        return view('teacher.class-performance.index', compact(
            'students',
            'academic_years',
            'subjects',
            'school_classes',
            'stats'
        ));
    }
}
