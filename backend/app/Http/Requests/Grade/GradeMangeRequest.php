<?php

namespace App\Http\Requests\Grade;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Override;

class GradeMangeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manageGrades', $this->exam);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $list = $this->exam->getStudents()->pluck('id')->all();

        return [
            'grades' => ['required', 'array'],
            'grades.*.student_id' => [
                'required',
                'distinct',
                Rule::in($list)
            ],
            'grades.*.score' => [
                'present',
                'nullable',
                'numeric',
                'gte:0',
                'lte:' . $this->exam->maximum_score
            ],
            'grades.*.comment' => [
                'sometimes',
                'nullable',
                'string',
                'min:2',
                'max:255'
            ]

        ];
    }

    #[Override]
    public function messages()
    {
        return [
            'grades.*.score.lte' =>
            'The score must be less than or equal to ' . $this->exam->maximum_score . '.',
            'grades.*.score.gte' =>
            'The score must be greater than or equal to 0.',
            'grades.*.student_id.required' => 'The selected student id is required.',
            'grades.*.student_id.distinct' => 'The selected student id is duplicated.',
            'grades.*.student_id.exists' => 'The selected student id is not exist.',
            'grades.*.student_id.in' => 'The selected student id do not belong to this exam.',
        ];
    }
}
