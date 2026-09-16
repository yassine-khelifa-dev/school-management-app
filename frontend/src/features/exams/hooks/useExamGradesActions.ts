import {  useState } from "react";
import useApiError from "../../../hooks/useApiError";
import type { GradesFormType } from "../types";
import { delay } from "../../enrollments/services/enrollmentService";
import { deleteGrade, updateExamGrades } from "../services/examGradeService";

export default function useExamGradesActions() {
  const { error, handleError, clearError } = useApiError();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const onUpdateGrades = async (
    exam_id: string,
    data: GradesFormType,
  ): Promise<boolean> => {
    try {
      clearError();
      setMessage("");
      setLoading(true);

      const res = await updateExamGrades(exam_id, data);
      if (res.status === 200) {
        setMessage("Grades Has been Updated with successfully!");
        return true;
      }
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      await delay(1000);
      setLoading(false);
    }
  };

  const onDelete = async (
    exam_id: number,
    grade_id?: number,
  ): Promise<boolean> => {
    if (!grade_id) return false;

    try {
      clearError();
      setMessage("");
      setLoading(true);
      const res = await deleteGrade(exam_id, grade_id);
      if (res.status === 204) {
        setMessage("Grades Has been deleted with successfully!");
        return true;
      } else return false;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      await delay(1000);
      setLoading(false);
    }
  };

  return {
    error,
    onDelete,
    loading,
    message,
    onUpdateGrades,
  };
}
