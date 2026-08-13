<?php

namespace App\Policies;

use App\Enums\RoleEnum;
use App\Models\Exam;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ExamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return  $user->role === RoleEnum::ADMIN->value;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Exam $exam): bool
    {
        return $user->role === RoleEnum::ADMIN->value ||
            ($user->role === RoleEnum::TEACHER->value && $user->teacher->id == $exam->teachingAssignment->teacher->id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === RoleEnum::ADMIN->value ||
            ($user->role === RoleEnum::TEACHER->value );
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Exam $exam): bool
    {
        return $user->role === RoleEnum::ADMIN->value ||
            ($user->role === RoleEnum::TEACHER->value && $user->teacher->id == $exam->teachingAssignment->teacher->id);
    }

     public function manageGrades(User $user, Exam $exam): bool
    {
        return $user->role === RoleEnum::ADMIN->value ||
            ($user->role === RoleEnum::TEACHER->value && $user->teacher->id == $exam->teachingAssignment->teacher->id);
    }



    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Exam $exam): bool
    {
        return  $user->role === RoleEnum::ADMIN->value;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Exam $exam): bool
    {
        return  $user->role === RoleEnum::ADMIN->value;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Exam $exam): bool
    {
        return  $user->role === RoleEnum::ADMIN->value;
    }
}
