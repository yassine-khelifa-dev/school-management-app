import { api } from "../../../api";
import type {
  EnrollmentFormType,
  EnrollmentListType,
  EnrollQueryType,
} from "../types";

export async function getEnrollments(
  query?: EnrollQueryType,
  signal?: AbortSignal,
): Promise<EnrollmentListType> {
  // console.log("run req: ", query);
  const res = await api.get("enrollments", {
    signal,
    params: {
      page: query?.page ?? 1,
      search: query?.filter.search,
      status: query?.filter.status,
      academicYearSelected: query?.filter.academicYearSelected,
      schoolClassesSelected: query?.filter.schoolClassesSelected,
    },
  });

  // console.log("run req res: ", res.data);

  return res.data;
}

export async function createEnrollment(data: EnrollmentFormType) {
  console.log("createEnrollment: before : ", data);

  //const res = api.post("enrollments", { data});
  // return res;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
