<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TeacherClassPerformanceRequest extends FormRequest
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
            'school_class' => [
                'nullable',
                'integer',
                Rule::exists('classes', 'id')
            ],
            'academic_year' => [
                'nullable',
                'integer',
                Rule::exists('academic_years', 'id')
            ],
            'subject' => [
                'nullable',
                'integer',
                Rule::exists('subjects', 'id')
            ],
            'q_field_sorted' => [
                'nullable',
                Rule::in([
                    'average_percentage',
                    'exams_count',
                    'first_name',
                    'last_name'
                ])
            ],
            'q_dir_sorted' => [
                'nullable',
                Rule::in(['asc', 'desc']),
            ],


        ];
    }
}
