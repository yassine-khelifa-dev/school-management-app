<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class, 'student_id', 'id');
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'student_id', 'id');
    }

    public function currentEnrollment()
    {
        return $this->hasOne(Enrollment::class, 'student_id', 'id')
            ->where('status', 'active')
            ->latestOfMany('enrolled_at');
    }


    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }


    public function scopeAssignedToTeacher(
        Builder $builder,
        Teacher $teacher,
        ?int $academicYear = null,
        ?int $schoolClass = null,
        ?string $fullname = null
    ): Builder {
        return $builder
            ->whereHas('enrollments', function ($enroll) use (
                $teacher,
                $academicYear,
                $schoolClass
            ) {
                $enroll
                    ->whereExists(function ($q) use ($teacher) {
                        $q->selectRaw('1')
                            ->from('teaching_assignments')
                            ->where(
                                'teaching_assignments.teacher_id',
                                $teacher->id
                            )
                            ->whereColumn(
                                'enrollments.academic_year_id',
                                'teaching_assignments.academic_year_id'
                            )
                            ->whereColumn(
                                'enrollments.class_id',
                                'teaching_assignments.class_id'
                            );
                    })
                    ->when(
                        $academicYear,
                        fn($q) => $q->where(
                            'academic_year_id',
                            $academicYear
                        )
                    )
                    ->when(
                        $schoolClass,
                        fn($q) => $q->where(
                            'class_id',
                            $schoolClass
                        )
                    );
            })
            ->when($fullname, function ($q) use ($fullname) {
                $q->searchByFullName($fullname);
            });
    }


    public function scopeSearchByFullName(Builder $builder, string $fullname): Builder
    {
        return  $builder->where(function ($q) use ($fullname) {
            $q->where(
                'first_name',
                'like',
                $fullname . '%'
            )->orWhere(
                'last_name',
                'like',
                $fullname . '%'
            );
        });
    }
}
