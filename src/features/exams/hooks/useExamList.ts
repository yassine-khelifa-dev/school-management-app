import { type ExamListType, type ExamQueryType } from "../types";
import { useEffect, useState } from "react";
import useApiError from "../../../hooks/useApiError";
import { getExams } from "../services/examService";

export default function useExamList() {
  const [examList, setExamList] = useState<ExamListType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { error, clearError, handleError } = useApiError();
 const [refreshKey, setRefreshKey] = useState(0);

  const [query, setQuery] = useState<ExamQueryType>({
    page: 1,
    filtre: {},
  });

  const changePage = (page: number) => {
   // console.log(page);
    setQuery((prev) => ({ ...prev, page: page }));
  };


const refresh = () => {
  setRefreshKey((prev) => prev + 1);
};

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        clearError();
        setLoading(true);
        const res = await getExams(query, controller.signal);
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
      controller.abort()
    };
  }, [query,refreshKey]);

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
