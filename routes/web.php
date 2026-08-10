<?php

use App\Http\Controllers\Web\ClassPerformanceController;
use App\Http\Controllers\Web\EnrollmentController;
use App\Http\Controllers\Web\ExamController;
use App\Http\Controllers\Web\ExamGradeController;
use App\Http\Controllers\Web\StudentAcademicProfileController;
use App\Http\Controllers\Web\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
Route::get('class-performance', [ClassPerformanceController::class, 'index'])->name('class-performance.index');
Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
Route::get('/exams/{exam}/grades', [ExamGradeController::class, 'index'])->name('exams-grades.index');
Route::post('/exams/{exam}/grades', [ExamGradeController::class, 'store'])->name('exams-grades.store');

Route::get('/students', [StudentController::class, 'index'])->name('students.index');
Route::get('/students/{student}/academic-profile', [StudentAcademicProfileController::class, 'show'])->name('students.academic-profile');
Route::get('/students/{student}/grades', [StudentAcademicProfileController::class, 'grades'])->name('students.grades');
