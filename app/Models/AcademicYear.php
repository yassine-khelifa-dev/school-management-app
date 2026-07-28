<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = [
        'name',
        'starts_at',
        'ends_at',
    ];

    protected function casts()
    {
        return [
            'starts_at' => 'date',
            'ends_at' => 'date'

        ];
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'academic_year_id', 'id');
    }

    public function teachingAssignments()
    {
        return $this->hasMany(TeachingAssignment::class, 'academic_year_id', 'id');
    }
}
