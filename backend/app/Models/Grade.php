<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'exam_id',
        'score',
        'comment',
        'graded_at',
    ];


    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id', 'id');
    }


    public function scopeForStatisticsScope(
        Builder $query,
        int $academicYear,
        ?int $schoolClass,
        ?Teacher $teacher
    ) {

        return $query->whereHas(
            'exam.teachingAssignment',
            fn($q) =>
            $q->where('academic_year_id', $academicYear)
                ->when($schoolClass,  fn($q) => $q->where('class_id', $schoolClass))
                ->when($teacher,  fn($q) => $q->where('teacher_id', $teacher->id))
        );
    }
}
