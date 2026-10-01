<?php

namespace App\Services;

use App\Enums\RoleEnum;
use App\Http\Resources\AcademicResource;
use App\Http\Resources\ClassResource;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\SubjectStatisticsResource;
use App\Http\Resources\TopStudentStatisticsResource;
use App\Models\AcademicYear;
use App\Models\Grade;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use App\Queries\StatisticsQuery;

class StatisticsService
{

    private int  $threshold = 50;

    public function __construct(
        private StatisticsQuery $statisticsQuery
    ) {}


    public function getFilterOptions(User  $user)
    {
        if ($user->role === RoleEnum::ADMIN->value)
            return [
                "academic_years" => AcademicResource::collection(AcademicYear::latest('starts_at')->get()),
                "classes" => ClassResource::collection(SchoolClass::all()),
                "subjects" => SubjectResource::collection(Subject::all())
            ];

        if (
            $user?->role === RoleEnum::TEACHER->value
            && $user->teacher
        ) {

            $teacher = $user->teacher;


            return [
                "academic_years" => AcademicResource::collection($teacher->academicYears()),
                "classes" => ClassResource::collection($teacher->schoolClasses()),
                "subjects" => SubjectResource::collection($teacher->subjects())
            ];
        }
        return response()->json([], 404);
    }

    public function getOverview(User  $user, array  $filters)
    {
        $teacher = $user->role === RoleEnum::TEACHER->value
            ? $user->teacher
            : null;

        return response()->json([
            "summary" => $this->getSummary($filters, $teacher),
            "subjects" =>
            SubjectStatisticsResource::collection(
                $this->statisticsQuery->subjectsOverview(
                    $filters['academic_year'],
                    $filters['school_class'] ?? null,
                    $teacher,
                    $this->threshold,
                )
            ),

        ], 200);
    }


    public function getSummary(array $filters, ?Teacher $teacher)
    {

        $performance = $this->statisticsQuery->subjectPerformanceCounts(
            $filters['academic_year'],
            $filters['school_class'] ?? null,
            $teacher,
            $this->threshold,
        );
        return [
            "students_count" =>
            $teacher ?  Student::assignedToTeacher(
                $teacher,
                $filters['academic_year'],
                $filters['school_class'] ?? null
            )->count() :

                Student::forAcademicYearAndClass(
                    $filters['academic_year'],
                    $filters['school_class'] ?? null
                )->count(),

            "graded_records_count" => Grade::forStatisticsScope(
                $filters['academic_year'],
                $filters['school_class'] ?? null,
                $teacher
            )->count(),

            "global_average" =>  $this->statisticsQuery->globalAverage(
                $filters['academic_year'],
                $filters['school_class'] ?? null,
                $teacher,
            ),

            "subjects_total" => Subject::forAcademicYear(
                $filters['academic_year'],
                $filters['school_class'] ?? null,
                $teacher
            )->count(),

            "subjects_passing" => $performance['passing'],
            "subjects_failing" => $performance['failing'],
        ];
    }


    public function getTopStudents(User  $user, Subject $subject, array $filters)
    {
        $teacher = $user->role === RoleEnum::TEACHER->value
            ? $user->teacher
            : null;

        $exists = $subject->teachingAssignments()
            ->where('academic_year_id', $filters['academic_year'])
            ->when(
                $filters['school_class'] ?? null,
                fn($q) =>
                $q->where('class_id', $filters['school_class'])
            )
            ->when($teacher,  fn($q) => $q->where('teacher_id', $teacher->id))
            ->exists();
        abort_unless($exists, 404);

        return response()->json([
            "subject" => [
                "id" => $subject->id,
                "name" => $subject->name
            ],
            "top_students" => TopStudentStatisticsResource::collection(
                $this->statisticsQuery
                    ->topStudents(
                        $subject,
                        $filters['academic_year'],
                        $filters['school_class'] ?? null,
                        $teacher,
                        $filters['limit'] ?? 3,
                    )
            )
        ], 200);
    }
}
