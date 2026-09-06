<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StudentStoreRequest;
use App\Http\Requests\Api\StudentUpdateRequest;
use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        /** @user = App/models/User */
        $user = Auth::user();

        //  dd($user->role);
        if ($user->role === "teacher") {
            $user->load('teacher');
            return $this->getStudentForTeacher($request, $user->teacher);
        } else if ($user->role === "admin")  return $this->getStudentForAdmin($request);
    }


    public function getStudentForAdmin(Request $request)
    {
        $qFullName = $request->input('fullname') ?? null;
        $query = Student::query()
            ->with(['user', 'enrollment.schoolClass', 'enrollment.academicYear', 'enrollments'])
            ->when($qFullName, function ($q)  use ($qFullName) {
                $q->where('first_name', 'like', "$qFullName%")
                    ->orWhere('last_name', 'like', "$qFullName%");
            })
            ->withCount('enrollments');

        $students = $query->latest()->paginate(8)->withQueryString();

        return   StudentResource::collection($students);
    }


    public function getStudentForTeacher(Request $request, Teacher $teacher)
    {
        $qFullName = $request->input('fullname') ?? null;
        $query = Student::query()
            ->with(['user', 'enrollment.schoolClass', 'enrollment.academicYear', 'enrollments'])
            ->whereHas('enrollments', function ($enrollment) use ($teacher) {
                $enrollment->whereExists(function ($query) use ($teacher) {
                    $query->selectRaw(1)
                        ->from('teaching_assignments')
                        ->where('teaching_assignments.teacher_id', $teacher->id)
                        ->whereColumn('enrollments.academic_year_id', 'teaching_assignments.academic_year_id')
                        ->whereColumn('enrollments.class_id', 'teaching_assignments.class_id');
                });
            })
            ->withCount('enrollments')
            ->when($qFullName, function ($q)  use ($qFullName) {
                $q->where('first_name', 'like', "$qFullName%")
                    ->orWhere('last_name', 'like', "$qFullName%");
            });
        $students = $query->latest()->paginate(8)->withQueryString();

        return   StudentResource::collection($students);
    }


    public function studentEnrollments(Request $request, Student $student)
    {

        $student->load(['enrollments.schoolClass', 'enrollments.academicYear']);


        return  EnrollmentResource::collection($student->enrollments->sortByDesc('enrolled_at'));
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
