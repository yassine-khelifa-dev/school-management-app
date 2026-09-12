import {
  type ExamType,
  type FormExam,
} from "../types";
import {  useState } from "react";
import useApiError from "../../../hooks/useApiError";
import {
  createExam,
  deleteExam,
  EditExam,
} from "../services/examService";

export default function useExamActions() {
  const [loading, setLoading] = useState<boolean>(false);
  const { error, clearError, handleError } = useApiError();
  const [message, setMessages] = useState<string | null>("");

 
  const edit = async (exam: ExamType, data: FormExam) => {
    try {
      clearError();
      setLoading(true);
      const res = await EditExam(exam, data);
      if (res.status === 200) {
        setMessages("Exam has been updated successfully with ID: " + exam.id);
        return true;
      }
      return false;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };



  const del = async (exam: ExamType) => {
    console.log(exam);

    try {
      setMessages("");
      clearError();
      setLoading(true);

      const res = await deleteExam(exam);

      if (res.status === 204) {
      
        

        setMessages("Exam has been deleted successfully with ID: " + exam.id);
        return true;
      }
      return false;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const create = async (exam: FormExam) => {
    try {
      setMessages("");
      clearError();
      setLoading(true);

      const res = await createExam(exam);

      if (res.status === 201) {

        setMessages("Exam has been created successfully");
        return true;
      }
      return false;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    del,
    message,
    clearError,
    edit,
    create,
  };
}
