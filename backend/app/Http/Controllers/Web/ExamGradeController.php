<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamGradeStoreRequest;
use App\Models\Exam;
use App\Services\ExamGradeService;
use Illuminate\Support\Facades\Gate;

class ExamGradeController extends Controller
{

    public function __construct(
        private readonly ExamGradeService $examGradeService
    ) {}


    public function index(Exam $exam)
    {
        Gate::authorize('manageGrades', $exam);

        return view(
            'exam-grades.index',
            $this->examGradeService->getEligibleStudentsWithGrades($exam)
        );
    }

    public function store(ExamGradeStoreRequest $request, Exam $exam)
    {
        Gate::authorize('manageGrades', $exam);

        $validated = $request->validated();

        if (empty($validated['scores'])) {
            return redirect()->route('exams-grades.index', $exam->id)
                ->with('warning', 'There are no grades to submit.');
        }

        $this->examGradeService->saveGrades($exam, $validated['scores']);

        return redirect()->route('exams-grades.index', $exam->id)->with('success', 'Grades saved successfully.');
    }


    public function teacherGrades(Exam $exam)
    {
        Gate::authorize('manageGrades', $exam);

        return view(
            'teacher.assigned-exams-grades',
            $this->examGradeService->getEligibleStudentsWithGrades($exam)
        );
    }

    public function storeTeacherGrades(ExamGradeStoreRequest $request, Exam $exam)
    {
        Gate::authorize('manageGrades', $exam);

        $validated = $request->validated();

        if (empty($validated['scores'])) {
            return redirect()->route('teacher.assigned-exams.grades', $exam->id)
                ->with('warning', 'There are no grades to submite.');
        }

        $this->examGradeService->saveGrades($exam, $validated['scores']);

        return redirect()->route('teacher.assigned-exams.grades', $exam->id)->with('success', 'Grades saved successfully.');
    }
}
