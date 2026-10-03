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
    academic_year: "1",
    subject: "1",
    school_class: "",
  });

  const [overviewList, setOverviewList] = useState<OverViewType>(null);
  const [list, setList] = useState<TopStudentsType>(null);

  const [loadingStatiPage, setLoadingStatiPage] = useState<boolean>(false);

  const setQuery = (key: string, value: string) => {
    console.log(key, value);

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
        const [resTopStud, resOverview] = await Promise.all([
          getTopStudents(query, controller.signal),
          getOverView(query, controller.signal),
        ]);

        setOverviewList(resOverview);
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
