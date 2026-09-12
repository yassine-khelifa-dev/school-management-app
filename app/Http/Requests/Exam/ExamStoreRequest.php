<?php

namespace App\Http\Requests\Exam;

use App\Models\TeachingAssignment;
use Gate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class ExamStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $teaching_assignment = TeachingAssignment::find($this->teaching_assignment_id);

        if (! $teaching_assignment) return false;

        return  Gate::allows('createExam', $teaching_assignment);
    }

    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'You are not allowed to create an exam for this teaching assignment.',
            ], 403)
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
            'teaching_assignment_id' => ['required', 'integer', Rule::exists('teaching_assignments', 'id')],
            'title' => ['required', 'string', 'min:5', 'max:255'],
            'exam_date' => ['required', 'date'],
            'maximum_score' => ['required', 'integer', 'min:1', 'max:1000'],
        ];
    }
}
