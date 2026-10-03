import { api } from "../../../api";
import type {
  OverViewType,
  StatiscticsFilterOptionsType,
  StatiscticsQueryType,
  TopStudentsType,
} from "../types";

export async function getTopStudents(
  query: StatiscticsQueryType,
  signal?: AbortSignal,
): Promise<TopStudentsType> {
  const { subject, academic_year, school_class, limit } = query;
  const res = await api.get(
    "statistics/subjects/" +
      (subject ?? 1) +
      "/top-students?academic_year=" +
      (academic_year ?? 1) +
      "&school_class=" +
      (school_class ?? "") +
      "&limit=" +
      (limit ?? 5),
    {
      signal,
    },
  );
  return res.data;
}

export async function getFilterOptions(): Promise<StatiscticsFilterOptionsType> {
  const res = await api.get("statistics/filter-options");
  return res.data;
}

export async function getOverView(
  query: StatiscticsQueryType,
  signal?: AbortSignal,
): Promise<OverViewType> {
  const res = await api.get("statistics/overview", {
    params: query,
    signal,
  });
  return res.data;
}
