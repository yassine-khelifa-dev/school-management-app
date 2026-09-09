<?php

namespace App\Policies;

use App\Models\TeachingAssignment;
use App\Models\User;
use Auth;
use Illuminate\Auth\Access\Response;

class TeachingAssignmentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TeachingAssignment $teachingAssignment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    public function createExam(User $user, TeachingAssignment $teachingAssignment): bool
    {
        if ($user?->isTeacher() && $user->teacher) {
            return
                TeachingAssignment::whereKey($teachingAssignment->id)
                ->forTeacher($user->teacher)
                ->exists();
        }
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TeachingAssignment $teachingAssignment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TeachingAssignment $teachingAssignment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TeachingAssignment $teachingAssignment): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TeachingAssignment $teachingAssignment): bool
    {
        return false;
    }
}
