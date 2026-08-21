<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StudentController extends Controller
{
    public function index()
    {
        $students = Student::with('user')->paginate(10);

        return   StudentResource::collection($students);
    }

    public function show(Student $student)
    {
        $student->load('user');
        return new StudentResource($student);
    }
}
