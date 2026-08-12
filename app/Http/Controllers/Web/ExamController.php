<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamIndexRequest;
use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Queries\ExamIndexQuery;
use App\Queries\TeacherAssignedExamsQuery;
use Illuminate\Support\Facades\Auth;

class ExamController extends Controller
{
    public function index(ExamIndexRequest $request, ExamIndexQuery $examIndexQuery)
    {

        //  dd( $request->all() );
        $filters = $request->validated();

        $academic_years = AcademicYear::latest('starts_at')->get();
        $subjects = Subject::orderBy('name', 'asc')->get();
        $school_classes = SchoolClass::orderBy('name', 'asc')->get();


        $exams =  $examIndexQuery->build($filters)
            ->paginate(20)
            ->withQueryString();


        return view('exams.index', compact(
            'exams',
            'academic_years',
            'subjects',
            'school_classes'
        ));
    }


    public function assignedExams(ExamIndexRequest $request, TeacherAssignedExamsQuery $teacherAssignedExamsQuery)
    {
        $teacher = Auth::user()->teacher()->firstOrFail();


        $filters = $request->validated();

        $exams =  $teacherAssignedExamsQuery->build($filters, $teacher)
            ->paginate(20)
            ->withQueryString();

        $academic_years = AcademicYear::query()
            ->whereHas(
                'teachingAssignments',
                fn($q) =>
                $q->where('teacher_id', $teacher->id)
            )
            ->orderBy('name')
            ->get();

        $subjects = Subject::query()
            ->whereHas(
                'teachingAssignments',
                fn($ta) => $ta->where('teacher_id', $teacher->id)
            )->orderBy('name')->get();

        $school_classes = SchoolClass::query()
            ->whereHas(
                'teachingAssignments',
                fn($ta) => $ta->where('teacher_id', $teacher->id)
            )->orderBy('name')->get();



        return view('teacher.assigned-exams', compact(
            'exams',
            'academic_years',
            'subjects',
            'school_classes'
        ));
    }
}
