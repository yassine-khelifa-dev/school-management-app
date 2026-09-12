import { type ExamListType, type ExamQueryType } from "../types";
import { useEffect, useState } from "react";
import useApiError from "../../../hooks/useApiError";
import { getExams } from "../services/examService";

export default function useExamList() {
  const [examList, setExamList] = useState<ExamListType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { error, clearError, handleError } = useApiError();

  const [query, setQuery] = useState<ExamQueryType>({
    page: 1,
    filtre: {},
  });

  const changePage = (page: number) => {
    console.log(page);
    setQuery((prev) => ({ ...prev, page: page }));
  };

  const refresh = () => {
  setQuery((prev) => ({ ...prev }));
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

  const changeFilter = (field: string, value: string) =>
    setQuery((prev) => ({
      ...prev,
      page: 1,
      filtre: {
        ...prev.filtre,
        [field]: value,
      },
    }));

  return {
    examList,
    loading,
    error,
    changePage,
    query,
    changeFilter,
    clearError,
    refresh,
  };
}
