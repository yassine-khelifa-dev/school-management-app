import {
  type ExamListType,
  type ExamQueryType,
  type ExamType,
  type FormExam,
} from "../types";
import { useEffect, useState } from "react";
import useApiError from "../../../hooks/useApiError";
import {
  createExam,
  deleteExam,
  EditExam,
  getExams,
} from "../services/examService";

export default function useExam() {
  const [examList, setExamList] = useState<ExamListType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { error, clearError, handleError } = useApiError();
  const [message, setMessages] = useState<string | null>("");

  const [query, setQuery] = useState<ExamQueryType>({
    page: 1,
    filtre: {},
  });

  const changePage = (page: number) => {
    console.log(page);
    setQuery((prev) => ({ ...prev, page: page }));
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        clearError();
        setLoading(true);
        const res = await getExams(query);
        // console.log(res);
        setExamList(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  const handleEditExam = async (exam: ExamType, data: FormExam) => {
    try {
      clearError();
      setLoading(true);
      const res = await EditExam(exam, data);
      if (res.status === 200) {
        changePage(query.page);
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

  const changeFilter = (field: string, value: string) =>
    setQuery((prev) => ({
      ...prev,
      page: 1,
      filtre: {
        ...prev.filtre,
        [field]: value,
      },
    }));

  const handleDeleteExam = async (exam: ExamType) => {
    console.log(exam);

    try {
      setMessages("");
      clearError();
      setLoading(true);

      const res = await deleteExam(exam);

      if (res.status === 204) {
        const remaining = examList.data.filter((en) => en.id !== exam.id);
        // update paginate and enroll-list:
        if (remaining.length === 0 && query.page > 1)
          changePage(query.page - 1);
        else {
          // remain the page has same enroll's size ( 8-row)
          changePage(query.page);
        }

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

  const handleCreateExam = async (exam: FormExam) => {
    try {
      setMessages("");
      clearError();
      setLoading(true);

      const res = await createExam(exam);

      if (res.status === 201) {
        changePage(query.page);

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
    examList,
    loading,
    error,
    changePage,
    handleDeleteExam,
    query,
    changeFilter,
    message,
    clearError,
    handleEditExam,
    handleCreateExam,
  };
}
