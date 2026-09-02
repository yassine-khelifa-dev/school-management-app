import { api } from "../../../api";
import type { AcademicYearsType } from "../types";

export async function getAcademicYears(): Promise<AcademicYearsType[]> {
  const res = await api.get("academic-year");
  return res.data.data;
}
