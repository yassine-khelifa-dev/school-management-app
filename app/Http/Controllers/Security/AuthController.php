<?php

namespace App\Http\Controllers\Security;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Security\LoginRequest;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function login()
    {

        $students = Student::query()
            ->with(['user'])
            ->whereHas(
                'enrollments',
                fn($q) => $q->where('class_id', 1)
                    ->where('academic_year_id', 27)
                    ->where('status', 'active')
            )
            ->withCount([
                'grades as graded_exam_count' =>
                fn($g) =>$g->whereNotNull('score')
                    ->whereHas(
                        'exam.teachingAssignment',
                        fn($g) =>  $g->where('class_id', 1)
                            ->where('academic_year_id', 27)
                    )
            ])
            ->withAvg([
                'grades' =>
                fn($g) => $g->whereNotNull('score')
                    ->whereHas(
                        'exam.teachingAssignment',
                        fn($g) =>  $g->where('class_id', 1)
                            ->where('academic_year_id', 27)
                    )
            ], 'score')
            ->get();

        $report = $students->map(function ($student) {

            $avg_val =  round( (float) $student->grades_avg_score, 2);
            $performance = 'needs_improvement';

            if ($avg_val >= 12 && $avg_val < 16)
                $performance = 'good';
            else if ($avg_val >= 16)
                $performance = 'excellent';

            return [
                'student_id' => $student->user->id,
                'student_name' => $student->full_name,
                'graded_exam_count' => $student->graded_exam_count,
                'average_score' => $avg_val,
                'performance' => $performance,
            ];
        })
            ->sortByDesc('average_score')
            ->values();

     //   dd($report);


        return view('auth.login');
    }

    public function store(LoginRequest $request)
    {
        $credentials = $request->validated();


        $remember = $request->boolean('remember');

        if (Auth::attempt(
            [
                'email' => $credentials['email'],
                'password' => $credentials['password'],
            ],
            $remember
        )) {
            $request->session()->regenerate();


            if (Auth::user()->role === RoleEnum::STUDENT->value)
                return redirect()->route('students.my-academic-profile');

            elseif (Auth::user()->role === RoleEnum::TEACHER->value)
                return redirect()->route('teacher.assigned-exams');

            return redirect()->intended('/');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
