<?php

use App\Http\Controllers\Web\EnrollmentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});



Route::resource('enrollments', EnrollmentController::class);
