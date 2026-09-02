import { api } from "../../../api";
import type { EnrollmentListType, EnrollQueryType } from "../types";

export async function getEnrollments(
  query?: EnrollQueryType,
): Promise<EnrollmentListType> {
 // console.log("run req: ", query);
  const res = await api.get("enrollments", {
    params: {
      page: query.page,
      status: query.filter.status,
      academicYearSelected: query.filter.academicYearSelected,
      schoolClassesSelected: query.filter.schoolClassesSelected
    },
  });

 // console.log("run req res: ", res.data);

  return res.data;
}
