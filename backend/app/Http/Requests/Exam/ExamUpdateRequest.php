<?php

namespace App\Http\Requests\Exam;

use App\Models\TeachingAssignment;
use Gate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExamUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user || ! $user->teacher) return false;

        return
            Gate::allows('update', $this->exam)
            &&
            (! $this->filled('teaching_assignment_id')
                ||
                TeachingAssignment::whereKey($this->teaching_assignment_id)
                ->forTeacher($user->teacher)
                ->exists()
            );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'teaching_assignment_id' => [
                'sometimes',

                'required',
                'integer',
                Rule::exists('teaching_assignments', 'id'),
            ],
            'title' => ['sometimes', 'required', 'string', 'min:5', 'max:255'],
            'exam_date' => ['sometimes', 'required', 'date'],
            'maximum_score' => ['sometimes', 'required', 'integer', 'min:1', 'max:1000'],
        ];
    }
}
