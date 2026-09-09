<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;


class TeachingAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'class_id',
        'subject_id',
        'academic_year_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'id');
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id', 'id');
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id', 'id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id', 'id');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class, 'teaching_assignment_id', 'id');
    }


    public function scopeForTeacherAssignmentContext(
        Builder $query,
        ?int $subjectId,
        ?int $teacherId,
        ?int $academicYearId,
        ?int $schoolClassId
    ): Builder {
        return $query
            ->where('teacher_id', $teacherId)
            ->where('class_id', $schoolClassId)
            ->where('subject_id', $subjectId)
            ->where('academic_year_id', $academicYearId);
    }

    public function scopeForTeacher(Builder $builder, Teacher $teacher): Builder
    {
        return  $builder->where('teacher_id', $teacher->id);
    }
}
