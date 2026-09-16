<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeachingAssignmentResource;
use App\Http\Resources\TeachingAssignmentSummaryResource;
use App\Models\TeachingAssignment;
use Auth;
use Gate;
use Illuminate\Http\Request;

class TeachingAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $teachingAssignment = TeachingAssignment::with([
            'schoolClass',
            'subject',
            'academicYear',
            'teacher'
        ])->get();

        return [
            'data' => TeachingAssignmentResource::collection($teachingAssignment),
            'user' => $user,
        ];
    }

    public function options(Request $request)
    {
        $this->authorize('options', TeachingAssignment::class);

        $user = Auth::user();
        $search = $request->input('search') ?? null;

        $query = TeachingAssignment::query()
            ->with([
                'schoolClass',
                'subject',
                'academicYear',
            ])
            ->when($search, function ($query) use ($search) {

                $query->where(function ($q) use ($search) {
                    $q->whereHas(
                        'schoolClass',
                        fn($a) =>
                        $a->where('name', 'like', "%{$search}%")
                    )
                        ->orWhereHas(
                            'subject',
                            fn($a) =>
                            $a->where('name', 'like', "%{$search}%")
                        )
                        ->orWhereHas(
                            'academicYear',
                            fn($a) =>
                            $a->where('name', 'like', "%{$search}%")
                        );
                });
            });


        if ($user->teacher) {
            $query->forTeacher($user->teacher);
        }
        return response()->json(
            TeachingAssignmentSummaryResource::collection(
                $query->get()
            ),
            200
        );
    }
}
