<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\TeacherMyStudentsRequest;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Queries\TeacherAssignedStudentsQuery;
use Illuminate\Http\Request;
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
}
