<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
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
}
