<?php

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\Security\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\GradeConroller;
use App\Http\Controllers\Api\TeachingAssignmentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::post('login', [AuthController::class, 'login'])->name('auth.login');

Route::middleware('auth:sanctum')->name('api.')->group(function () {

    // ========= for Admin and Teacher :

    Route::get('me', function () {
        $user =  Auth::user();
        return ['role' => $user->role];
    });


    Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
    //  students
    Route::get('students', [StudentController::class, 'index'])->name('students.index');
    Route::get('students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::get('students/{student}/enrollments', [StudentController::class, 'studentEnrollments'])->name('students.enrollments');
    // Grade:
    Route::get('exam/{exam}/grades', [GradeConroller::class, 'index'])->name('exam.grades.index');
    //  Exams
    Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get("exams/filter-options", [ExamController::class, 'filterOptions'])->name('exam.filter-options');
    Route::get('exams/{exam}', [ExamController::class, 'show'])->name('exams.show');
    Route::delete('exams/{exam}', [ExamController::class, 'destroy'])->name('exams.destroy');
    // TeachingAssignment
    Route::get('teaching-assignments', [TeachingAssignmentController::class, 'index'])->name('teachingAssignments.index');
    Route::get('teaching-assignments/options', [TeachingAssignmentController::class, 'options'])->name('teachingAssignments.options');
    // END --- for Admin and Teacher


    Route::middleware('role:admin')->group(function () {
        // students :
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::patch('students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
        // Enrolls:
        Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
        Route::post('enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');
        Route::patch('enrollments/{enrollment}', [EnrollmentController::class, 'update'])->name('enrollments.update');
        Route::delete('enrollments/{enrollment}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

        // SchoolClass:
        Route::get('school-class', [SchoolClassController::class, 'index'])->name('school-class.index');
        // AcademicYear:
        Route::get('academic-year', [AcademicYearController::class, 'index'])->name('academic-year.index');
    });


    Route::middleware('role:teacher')->group(function () {
        //Grade:
        Route::patch('exam/{exam}/grades', [GradeConroller::class, 'manage'])->name('exam.grades.manage');
        Route::delete('exam/{exam}/grades/{grade}', [GradeConroller::class, 'destroy'])->name('exam.grades.destroy');

        // Exam :
        Route::post('exams', [ExamController::class, 'store'])->name('exams.store');
        Route::patch('exams/{exam}', [ExamController::class, 'update'])->name('exams.update');
    });
});
