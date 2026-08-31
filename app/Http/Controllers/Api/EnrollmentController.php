<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Enrollment::query()->with([
            'student.user',
            'academicYear',
            'schoolClass'
        ]);

        $enrlls =  $query->paginate(10)
            ->withQueryString();

        return EnrollmentResource::collection($enrlls);
    }
}
