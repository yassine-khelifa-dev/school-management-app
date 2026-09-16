<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SchoolClass extends Model
{
        use HasFactory;


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
