<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\StatisticsOverviewRequest;
use App\Http\Resources\AcademicResource;
use App\Http\Resources\ClassResource;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\SubjectStatisticsResource;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StatisticController extends Controller
{
    public function filterOptions(Request $requet)
    {
        if (Auth::user()->role === RoleEnum::ADMIN->value)
            return [
                "academic_years" => AcademicResource::collection(AcademicYear::latest('starts_at')->get()),
                "classes" => ClassResource::collection(SchoolClass::all()),
                "subjects" => SubjectResource::collection(Subject::all())
            ];

        if (
            Auth::user()?->role === RoleEnum::TEACHER->value
            && Auth::user()->teacher
        ) {

            $teacher = Auth::user()->teacher;

            return [
                "academic_years" => AcademicResource::collection($teacher->academicYears()),
                "classes" => ClassResource::collection($teacher->schoolClasses()),
                "subjects" => SubjectResource::collection($teacher->subjects())
            ];
        }
        return response()->json([], 404);
    }


    public function topStudents(Request $request, Subject $subject)
    {
        $filters = $request->validate([
            'school_class' => [
                'nullable',
                'integer',
                Rule::exists('classes', 'id')
            ],
            'academic_year' => [
                'required',
                'integer',
                Rule::exists('academic_years', 'id')
            ],
            'limit' => [
                'nullable',
                'integer',
                'min:3',
                'max:5'
            ]
        ]);

        return response()->json([
            "subject" => [
                "id" => $subject->id,
                "name" => $subject->name
            ],
            "top_students" => $subject
                ->topStudents(
                    $filters['academic_year'],
                    $filters['school_class'] ?? null,
                    $filters['limit'] ?? 3
                )
                ->get()
        ], 200);
    }


    public function overview(StatisticsOverviewRequest $requet)
    {
        $filter = $requet->validated();
        $threshold = 50;

        //  dd(Subject::checkScore($filter['academic_year'], $midle, '<')->get()->pluck('avg_total'));

        return response()->json([
            "summary" => [
                "students_count" => Student::forAcademicYearAndClass(
                    $filter['academic_year'],
                    $filter['school_class'] ?? null
                )->count(),
                "graded_records_count" => Grade::forStatisticsScope(
                    $filter['academic_year'],
                    $filter['school_class'] ?? null
                )->count(),
                "global_average" => number_format(Grade::globalAverage(
                    $filter['academic_year'],
                    $filter['school_class'] ?? null
                ), 2),
                "subjects_total" => Subject::forAcademicYear($filter['academic_year'], $filter['school_class'] ?? null)->count(),
                "subjects_passing" => Subject::withAverageComparison($filter['academic_year'], $filter['school_class'] ?? null, $threshold, '>=')->count(),
                "subjects_failing" => Subject::withAverageComparison($filter['academic_year'], $filter['school_class'] ?? null, $threshold, '<')->count()
            ],
            "subjects" =>
            SubjectStatisticsResource::collection(
                Grade::globalAverageBySubject(
                    $filter['academic_year'],
                    $filter['school_class'] ?? null
                )->get()
            ),



        ], 200);
    }
}
