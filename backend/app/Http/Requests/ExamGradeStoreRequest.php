<?php

namespace App\Http\Requests;

use App\Models\Exam;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExamGradeStoreRequest extends FormRequest
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
        /** @var Exam $exam */
        $exam =  $this->route('exam');

        return [
            'scores' => [
                'nullable',
                'array'
            ],
            'scores.*.student_id' => [
                'nullable',
                'integer',
                'distinct',
                Rule::exists('students', 'id')
            ],
            'scores.*.score' => [
                'nullable',
                'numeric',
                'min:0',
                'max:' . $exam->maximum_score,
            ],

        ];
    }

    public function messages(): array
    {
        return [
            'scores.*.student_id.required' => 'The student ID is required.',
            'scores.*.student_id.integer' => 'The student ID must be an integer.',
            'scores.*.student_id.distinct' => 'The same student cannot appear twice.',
            'scores.*.student_id.exists' => 'This student does not exist.',

            'scores.*.score.numeric' => 'The score must be a number.',
            'scores.*.score.min' => 'The score cannot be less than 0.',
            'scores.*.score.max' => 'The score cannot be greater than the exam maximum score.',
        ];
    }
}
