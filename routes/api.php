<?php

use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\SchoolClassController;
use App\Http\Controllers\Api\Security\AuthController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::post('login', [AuthController::class, 'login'])->name('auth.login');

Route::get("/test", function () {

    return response()->json([
        'id' => 1,
        'name' => 'Yassine'
    ]);
});


Route::middleware('auth:sanctum')->name('api.')->group(function () {

    Route::get('me', function () {
        $user =  Auth::user();

        return [
            'role' => $user->role
        ];
    });

    Route::middleware('role:admin')->group(function () {

        // students :
        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::patch('students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

        // Enrolls:
        Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
        Route::post('enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');
        Route::patch('enrollments/{enrollment}', [EnrollmentController::class, 'update'])->name('enrollments.update');

        // SchoolClass:
        Route::get('school-class', [SchoolClassController::class, 'index'])->name('school-class.index');
        // AcademicYear:
        Route::get('academic-year', [AcademicYearController::class, 'index'])->name('academic-year.index');
    });

    Route::get('students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
});
