<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Override;

class Enrollment extends Model
{
    protected $fillable = [
        'student_id',
        'class_id',
        'academic_year_id',
        'enrolled_at',
        'status',
    ];

    #[Override]
    protected function casts()
    {
        return [
            'enrolled_at' => 'datetime'
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id', 'id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id', 'id');
    }
}
