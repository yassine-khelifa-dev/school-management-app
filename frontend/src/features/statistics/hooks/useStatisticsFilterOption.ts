import { useEffect, useState } from "react";
import { getFilterOptions } from "../services/statisticsService";
import useApiError from "../../../hooks/useApiError";
import { type StatiscticsFilterOptionsType } from "../types";

export function useStatisticsFilterOption() {
  const { error, clearError, handleError } = useApiError();

  const [filterOptions, setFilterOptions] =
    useState<StatiscticsFilterOptionsType|null>(null);

  const [loadingFilterOptions, setLoadingStatiPage] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      try {
        clearError();
        setLoadingStatiPage(true);
        const res = await getFilterOptions();
        setFilterOptions(res);
      } catch (err) {
        handleError(err);
      } finally {
        setLoadingStatiPage(false);
      }
    };
    getData();
  }, []);

  return {
    filterOptions,
    errorFilterOptions: error,
    loadingFilterOptions,
  };
}
