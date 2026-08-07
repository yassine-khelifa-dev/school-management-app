<?php

use App\Http\Controllers\Web\ClassPerformanceController;
use App\Http\Controllers\Web\EnrollmentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
Route::get('class-performance', [ClassPerformanceController::class, 'index'])->name('class-performance.index');
