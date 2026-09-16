import { useUser } from "../../../contexts/UserContext";

export const useExamPolicy = () => {
  const { user } = useUser();

  return {
    canViewAny: user.user.role === "teacher" || user.user.role === "admin",
    canCreate: user.user.role === "teacher",
    canEdit: user.user.role === "teacher",
    canDelete: user.user.role === "teacher" || user.user.role === "admin",
    canManageGrades: user.user.role === "teacher",
  };
};
