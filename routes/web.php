<?php

use App\Http\Controllers\Web\ClassPerformanceController;
use App\Http\Controllers\Web\EnrollmentController;
use App\Http\Controllers\Web\ExamController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
Route::get('class-performance', [ClassPerformanceController::class, 'index'])->name('class-performance.index');
Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
Route::get('/exams/{exam}/grades', [ExamController::class, 'manageGrades'])->name('exams.manage-grades');



