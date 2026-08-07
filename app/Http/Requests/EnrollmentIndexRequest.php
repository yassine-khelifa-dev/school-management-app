<?php

namespace App\Http\Requests;

use App\Enums\EnrollmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EnrollmentIndexRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'q_student_full_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'q_status' => [
                'nullable',
                Rule::enum(EnrollmentStatus::class),
            ],

            'q_academic_year' => [
                'nullable',
                'integer',
                Rule::exists('academic_years', 'id'),
            ],
            'q_school_class' => [
                'nullable',
                'integer',
                Rule::exists('classes', 'id'),
            ],
            'q_field_sorted' => [
                'nullable',
                Rule::in(['enrollment_id', 'last_name', 'first_name', 'class_name']),
            ],
            'q_dir_sorted' => [
                'nullable',
                Rule::in(['asc', 'desc']),
            ]
        ];
    }
}
