import { api } from "../../../api";
import type { StudentType } from "../types";

export async function getStudents(): Promise<StudentType[]> {
  const res = await api.get("student");
  return res.data.data;
}

export const delayTestFetachData = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
