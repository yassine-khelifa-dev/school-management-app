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
            'grades' => ['required', 'array'],
            'grades.*.student_id' => ['required', Rule::exists(Student::class, 'id')],
            'grades.*.score' => ['required', 'gt:0', 'lt:' . $this->exam->maximum_score]

        ];
    }

    #[Override]
    public function messages()
    {
        return [
            'grades.*.score.lt' => 'The score field must be less than ' . $this->exam->maximum_score . '.',
            'grades.*.score.gt' => 'The score field must be greater than  0.',
            'grades.*.student_id' => 'The selected student id is invalid.',

        ];
    }
}
