import { api } from "../../../api";
import type { StudentListType, StudentQueryType } from "../types";

export async function getStudents(
  query: StudentQueryType,
  signal?: AbortSignal,
): Promise<StudentListType> {
  const res = await api.get("students", {
    params: query,
    signal,
  });
  return res.data;
}

export const delayTestFetachData = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
