import { type ExamListType, type ExamQueryType } from "../types";
import { useEffect, useState } from "react";
import useApiError from "../../../hooks/useApiError";
import { getExams } from "../services/examService";
import { useSearchParams } from "react-router-dom";

export default function useExamList() {
  const [examList, setExamList] = useState<ExamListType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { error, clearError, handleError } = useApiError();
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState<ExamQueryType>({
    page: Number(searchParams.get("page")) || 1,
    filtre: {
      subject: searchParams.get("subject") || undefined,
      academic_year: searchParams.get("academic_year") || undefined,
      school_class: searchParams.get("school_class") || undefined,
      q_field_sorted:
        (searchParams.get("q_field_sorted") as
          | "title_exam"
          | "exam_date"
          | null) ?? undefined,
      q_dir_sorted: searchParams.get("q_dir_sorted") || undefined,
    },
  });

  const changePage = (page: number) => {
    setQuery((prev) => ({
      ...prev,
      page,
    }));

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(page));
      return params;
    });
  };

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const changeFilter = (field: string, value: string) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      filtre: {
        ...prev.filtre,
        [field]: value,
      },
    }));

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      params.set("page", "1");

      if (value) {
        params.set(field, value);
      } else {
        params.delete(field);
      }

      return params;
    });
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
      controller.abort();
    };
  }, [query, refreshKey]);

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
