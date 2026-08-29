import { api } from "../../../api";
import type { StudentListType, StudentQueryType } from "../types";

export async function getStudents(
  query: StudentQueryType,
): Promise<StudentListType> {
  console.log(" before::", query);
  const res = await api.get("students", {
    params: { ...query },
  });
  return res.data;
}

export const delayTestFetachData = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
