import { useEffect, useState } from "react";
import type { ExamGradeType } from "../types";
import useApiError from "../../../hooks/useApiError";
import { getExamGrades } from "../services/examGradeService";

export default function useExamGrades(id: string) {
  const [grades, setGrades] = useState<ExamGradeType | null>(null);
  const { error, handleError, clearError } = useApiError();
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        clearError();
        setLoading(true);

        const res = await getExamGrades(id, controller.signal);

        setGrades(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [id, refreshKey]);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return {
    grades,
    refresh,
    error,
    loading,
  };
}
