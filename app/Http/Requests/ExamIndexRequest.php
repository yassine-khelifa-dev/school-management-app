<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExamIndexRequest extends FormRequest
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
            'academic_year' => [
                'nullable',
                'integer',
                Rule::exists('academic_years', 'id'),
            ],
            'school_class' => [
                'nullable',
                'integer',
                Rule::exists('classes', 'id'),
            ],
            'subject' => [
                'nullable',
                'integer',
                Rule::exists('subjects', 'id'),
            ],
            'q_field_sorted' => [
                'nullable',
                Rule::in(['title_exam', 'exam_date']),
            ],
            'q_dir_sorted' => [
                'nullable',
                Rule::in(['asc', 'desc']),
            ]
        ];
    }
}
