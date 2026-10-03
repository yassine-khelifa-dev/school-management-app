import { useEffect, useState } from "react";
import { getOverView, getTopStudents } from "../services/statisticsService";
import useApiError from "../../../hooks/useApiError";
import {
  type StatiscticsQueryType,
  type TopStudentsType,
  type OverViewType,
} from "../types";

export function useStatistics() {
  const { error, clearError, handleError } = useApiError();

  const [query, setQueryState] = useState<StatiscticsQueryType>({
    academic_year: undefined,
    subject: "all",
    school_class: "all",
  });

  const [overviewList, setOverviewList] = useState<OverViewType>(null);
  const [list, setList] = useState<TopStudentsType>(null);

  const [loadingStatiPage, setLoadingStatiPage] = useState<boolean>(false);

  const setQuery = (key: string, value: string) => {
    console.log(key, value);

    if (key === "subject" && value == "all") setList(null);

    setQueryState((prev) => {
      const nq = {
        ...prev,
        [key]: value,
      };
      return nq;
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const getData = async () => {
      try {
        clearError();
        setLoadingStatiPage(true);

        const q = {
          academic_year: query.academic_year,

          ...(query.subject !== "all" && query.subject
            ? { subject: query.subject }
            : {}),

          ...(query.school_class !== "all" && query.school_class
            ? { school_class: query.school_class }
            : {}),
        };

        if (!q.academic_year) return;
        const resOverview = await getOverView(q, controller.signal);
        setOverviewList(resOverview);

        if (!q.subject) return;
        const resTopStud = await getTopStudents(q, controller.signal);
        setList(resTopStud);
      } catch (err) {
        handleError(err);
      } finally {
        setLoadingStatiPage(false);
      }
    };
    getData();

    return () => {
      controller.abort();
    };
  }, [query]);

  return {
    list,
    query,
    overviewList,
    error,
    loadingStatiPage,
    setQuery,
  };
}
