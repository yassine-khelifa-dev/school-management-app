<?php

require __DIR__  . '/_auth.php';

use App\Http\Controllers\Web\ClassPerformanceController;
use App\Http\Controllers\Web\EnrollmentController;
use App\Http\Controllers\Web\ExamController;
use App\Http\Controllers\Web\ExamGradeController;
use App\Http\Controllers\Web\StudentAcademicProfileController;
use App\Http\Controllers\Web\StudentController;
use App\Http\Controllers\Web\TeacherController;
use Illuminate\Support\Facades\Route;


Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::get('/', function () {
        return redirect()->route('enrollments.index');
    });

    Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::get('class-performance', [ClassPerformanceController::class, 'index'])->name('class-performance.index');
    Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('/exams/{exam}/grades', [ExamGradeController::class, 'index'])->name('exams-grades.index');
    Route::post('/exams/{exam}/grades', [ExamGradeController::class, 'store'])->name('exams-grades.store');

    Route::get('/students', [StudentController::class, 'index'])->name('students.index');
    // ADMIN :
    Route::get('/students/{student}/academic-profile', [StudentAcademicProfileController::class, 'show'])->name('students.academic-profile');
    Route::get('/students/{student}/grades', [StudentAcademicProfileController::class, 'grades'])->name('students.grades');
});

//
Route::middleware(['auth', 'role:teacher'])->group(function () {

    Route::get('teacher/assigned-exams', [ExamController::class, 'assignedExams'])->name('teacher.assigned-exams');
    Route::get('/exams/{exam}/grades', [ExamGradeController::class, 'teacherGrades'])->name('teacher.assigned-exams.grades');
    Route::post('/exams/{exam}/grades', [ExamGradeController::class, 'storeTeacherGrades'])->name('teacher.assigned-exams.grades.store');

    // my students:
    Route::get('/teacher/students', [TeacherController::class, 'students'])->name('teacher.students.index');
});



Route::middleware(['auth', 'role:student'])->group(function () {
    // Student :
    Route::get('/my/academic-profile', [StudentAcademicProfileController::class, 'myAcademicProfile'])->name('students.my-academic-profile');
    Route::get('/my/grades', [StudentAcademicProfileController::class, 'myGrades'])->name('students.my-grades');
});
