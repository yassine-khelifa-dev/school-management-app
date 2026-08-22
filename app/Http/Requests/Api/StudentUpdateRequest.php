<?php

namespace App\Http\Requests\Api;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(Request $request): array
    {
        $student = $request->route('student');

        return  [
            'first_name' => ['sometimes'],
            'last_name' => ['sometimes'],
            'phone' => ['sometimes', 'min:10', 'max:14'],
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users', 'email')->ignore($student->user_id)
            ]
        ];
    }
}
