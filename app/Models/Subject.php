<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function teachingAssignments()
    {
        return $this->hasMany(TeachingAssignment::class, 'subject_id', 'id');
    }
}
