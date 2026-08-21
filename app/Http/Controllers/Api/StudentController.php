<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StudentStoreRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

    public function store(StudentStoreRequest $request)
    {
        $data = $request->validated();
        $newStudent  = DB::transaction(function () use ($data) {

            $newUser = User::create([
                'email' => $data['email'],
                'password' =>  Hash::make('password')
            ]);

            $data['user_id'] = $newUser->id;

            return Student::create(
                Arr::except($data, ['email'])
            );
        });

        $newStudent->load('user');

        return  Response()->json(
            new StudentResource($newStudent),
            201
        );
    }
}
