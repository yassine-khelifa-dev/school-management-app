<?php

namespace App\Models;

use App\Http\Resources\StudentResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;


class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'teaching_assignment_id',
        'title',
        'exam_date',
        'description',
        'maximum_score',
    ];

    protected function casts()
    {
        return [
            'exam_date' => 'date',
            'maximum_score' => 'integer'

        ];
    }

    public function teachingAssignment()
    {
        return $this->belongsTo(TeachingAssignment::class, 'teaching_assignment_id', 'id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'exam_id', 'id');
    }


    public function scopeAssignedToTeacher(Builder $builder, Teacher $teacher): Builder
    {
        return $builder->WhereHas('teachingAssignment', function ($q)  use ($teacher) {
            $q->where('teacher_id', $teacher->id);
        });
    }


    public function getStudents()
    {

        return Student::query()->withCount('enrollments')
            ->whereHas('enrollments', function ($enroll) {
                $enroll->whereExists(function ($q) {
                    $q->selectRaw(1)
                        ->from('teaching_assignments')
                        ->where('teaching_assignments.id', $this->teaching_assignment_id)
                        ->whereColumn('teaching_assignments.academic_year_id', 'enrollments.academic_year_id')
                        ->whereColumn('teaching_assignments.class_id', 'enrollments.class_id');
                });
            })->get();
    }
}
