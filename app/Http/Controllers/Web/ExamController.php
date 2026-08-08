<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamIndexRequest;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Queries\ExamIndexQuery;
use Illuminate\Http\Request;

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
            ->paginate(200)
            ->withQueryString();


        return view('exams.index', compact(
            'exams',
            'academic_years',
            'subjects',
            'school_classes'
        ));
    }

    public function manageGrades(Request $request, Exam $exam)
    {

        return $exam;
    }
}
