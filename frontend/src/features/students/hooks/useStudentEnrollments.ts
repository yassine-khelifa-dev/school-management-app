import { useState } from "react";
import { getStudentEnrollments } from "../services/studentService";
import useApiError from "../../../hooks/useApiError";

export function useStudentEnrollments() {
  const [loading, setLoading] = useState(false);
  const { error, clearError, handleError } = useApiError();

  async function myEnrollments(student_id: number) {
    try {
      setLoading(true);
      clearError();
      const res = await getStudentEnrollments(student_id);
      //console.log("student id: ", student_id);
      return res;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }

  return {
    myEnrollments,
    loading,
    error,
    clearError,
  };
}
