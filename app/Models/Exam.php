<?php

namespace App\Models;

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
}
