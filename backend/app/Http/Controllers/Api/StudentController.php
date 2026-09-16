<?php

namespace App\Http\Controllers\Api;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StudentStoreRequest;
use App\Http\Requests\Api\StudentUpdateRequest;
use App\Http\Requests\TeacherMyStudentsRequest;
use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Queries\TeacherAssignedStudentsQuery;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(
        TeacherMyStudentsRequest $request,
        TeacherAssignedStudentsQuery $teacherAssignedStudentsQuery
    ) {

        $this->authorize('viewAny', Student::class);

        /** @user = App/models/User */
        $user = Auth::user();
        switch ($user->role) {
            case RoleEnum::TEACHER->value: {
                    // check Teacher :
                    $teacher = $user->teacher;

                    if (! $teacher) abort(403);

                    return $this->getStudentForTeacher(
                        $request,
                        $teacher,
                        $teacherAssignedStudentsQuery
                    );
                }
            case RoleEnum::ADMIN->value:
                return $this->getStudentForAdmin($request);
            default:
                abort(403);
        }
    }

    public function getStudentForAdmin(TeacherMyStudentsRequest $request,)
    {
        $fullname = $request->input('fullname') ?? null;
        $query = Student::query()
            ->with([
                'user',
                'currentEnrollment.schoolClass',
                'currentEnrollment.academicYear',
            ])
            ->when($fullname, function ($q)  use ($fullname) {
                $q->searchByFullName($fullname);
            })
            ->withCount('enrollments');

        $students = $query->latest()->paginate(8)->withQueryString();

        return   StudentResource::collection($students);
    }


    public function getStudentForTeacher(
        TeacherMyStudentsRequest $request,
        Teacher $teacher,
        TeacherAssignedStudentsQuery $teacherAssignedStudentsQuery
    ) {
        $query = $teacherAssignedStudentsQuery
            ->build($request->validated(), $teacher)
            ->with([
                'user',
                'currentEnrollment.schoolClass',
                'currentEnrollment.academicYear',
            ])
            ->withCount('enrollments');
        $students = $query->latest()->paginate(8)->withQueryString();

        return   StudentResource::collection($students);
    }

    public function studentEnrollments(Request $request, Student $student)
    {
        $this->authorize('view', $student);

        $student->load([
            'enrollments.schoolClass',
            'enrollments.academicYear',
        ]);

        return  EnrollmentResource::collection($student->enrollments->sortByDesc('enrolled_at'));
    }

    public function show(Student $student)
    {
        $this->authorize('view', $student);

        $student->load('user');
        return new StudentResource($student);
    }

    public function store(StudentStoreRequest $request)
    {
        $this->authorize('create', Student::class);

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
        $this->authorize('update', $student);
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
        $this->authorize('delete', $student);

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
