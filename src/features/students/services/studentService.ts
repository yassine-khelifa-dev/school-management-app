import { api } from "../../../api";
import type { StudentListType } from "../types";

export async function getStudents(page?: number): Promise<StudentListType> {
  const res = await api.get("students", {
    params: { page },
  });
  return res.data;
}

export const delayTestFetachData = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
