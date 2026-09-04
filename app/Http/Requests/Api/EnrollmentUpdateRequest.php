<?php

namespace App\Http\Requests\Api;

use App\Models\AcademicYear;
use App\Models\SchoolClass;
use App\Models\Student;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EnrollmentUpdateRequest extends FormRequest
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
            "student_id" => [
                "sometimes",
                "required",
                "integer",
                Rule::exists(Student::class, 'id'),
                Rule::unique('enrollments', 'student_id')
                    ->ignore( $this->enrollment->id)
                    ->where(
                        fn($query) =>
                        $query->where(
                            'academic_year_id',
                            $this->academic_year_id
                        )
                    ),
            ],
            "academic_year_id" => ["sometimes", "required", "integer", Rule::exists(AcademicYear::class, 'id')],
            "class_id" => ["sometimes", "required", "integer", Rule::exists(SchoolClass::class, 'id')],
            "enrolled_at" => ["sometimes", "required", "date_format:Y-m-d"],
            "status" => ["sometimes", "required", Rule::in(['active', 'completed', 'cancelled'])],
        ];
    }


    public function messages(): array
    {
        return [
            'student_id.unique' =>
            'This student is already enrolled for this academic year.',
        ];
    }
}
