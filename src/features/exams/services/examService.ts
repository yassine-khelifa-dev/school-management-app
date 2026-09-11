import { api } from "../../../api";
import { delay } from "../../enrollments/services/enrollmentService";
import type {
  ExamFilterType,
  ExamListType,
  ExamQueryType,
  ExamType,
} from "../types";

export async function getExams(query: ExamQueryType): Promise<ExamListType> {
  console.log("before: getExams query:", query);
  const res = await api.get("exams", {
    params: {
      page: query.page,
      ...query.filtre,
    },
  });

  await delay(100);
  return res.data;
}

export async function getFilterOptions(): Promise<ExamFilterType> {
  const res = await api.get("exams/filter-options");
  return res.data;
}

export async function deleteExam(exam: ExamType) {
  const res = await api.delete("exams/" + exam.id);
  return res;
}
