<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function teachingAssignments()
    {
        return $this->hasMany(TeachingAssignment::class, 'subject_id', 'id');
    }

    public function scopeForAcademicYear(
        Builder $query,
        int $academicYear,
        ?int $schoolClass = null,
        ?Teacher $teacher,

    ): Builder {

        return $query->whereHas(
            'teachingAssignments',
            fn($q) =>
            $q->where('academic_year_id', $academicYear)
                ->when(
                    $schoolClass,
                    fn($q) => $q->where('class_id', $schoolClass)
                )
                ->when(
                    $teacher,
                    fn($q) => $q->where('teacher_id', $teacher->id)
                )
        );
    }

}
