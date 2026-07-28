<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{

    protected $table = 'classes';

    protected $fillable = [
        'name',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'class_id', 'id');
    }

    public function teachingAssignments()
    {
        return $this->hasMany(TeachingAssignment::class, 'class_id', 'id');
    }
}
