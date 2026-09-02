import { api } from "../../../api";
import type { SchoolClassType } from "../types";

export default async function getSchoolClasses(): Promise<SchoolClassType[]> {
  const res = await api.get("school-class");

  return res.data.data;
}
