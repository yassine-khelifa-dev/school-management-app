import { useUser } from "../../../contexts/UserContext";

export default function useStudentPolicy() {
  const { user } = useUser();

  const role = user?.user.role;

  const canEdit = role === "admin";
  const canDelete = role === "admin";

  return {
    canAdd: role === "admin",
    canEdit,
    canDelete,
    canShow: role === "admin" || role === "teacher",
    hasActions: canEdit || canDelete,
  };
}
