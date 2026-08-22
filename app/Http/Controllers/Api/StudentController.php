<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StudentStoreRequest;
use App\Http\Requests\Api\StudentUpdateRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
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


    public function update(StudentUpdateRequest $request, Student $student)
    {
        $data = $request->validated();

        $student->load('user');

        $updatedStudent =  DB::transaction(function () use ($data, $student) {

            if (isset($data['email']))
                $student->user()->update([
                    'email' => $data['email']
                ]);

            $student->update(Arr::except($data, 'email'));

            return $student;
        });

        $updatedStudent->load('user');

        return new StudentResource($updatedStudent);
    }


    public function destroy(Student $student)
    {
        $student->load('user');


        if ($student->enrollments()->exists()) {
            return response()->json([
                'message' => "Student cannot be deleted because related records exist."
            ], 409);
        }

        $student->user->delete();

        return response()->noContent();
    }
}
