import { api } from "../../../api";
import type { TeachingAssignmentSummaryType } from "../types";

export default async function getOptionsTeachingAssignment(): Promise<
  TeachingAssignmentSummaryType[]
> {
  const res = await api.get("teaching-assignments/options");

  return res.data;
}
