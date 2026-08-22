<?php

use App\Http\Controllers\Api\Security\AuthController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;


Route::post('login', [AuthController::class, 'login'])->name('auth.login');


Route::middleware('auth:sanctum')->name('api.')->group(function () {
    Route::get('students', [StudentController::class, 'index'])->name('students.index');
    Route::get('students/{student}', [StudentController::class, 'show'])->name('students.show');
    Route::post('students', [StudentController::class, 'store'])->name('students.store');
    Route::patch('students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');


    Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');
});
