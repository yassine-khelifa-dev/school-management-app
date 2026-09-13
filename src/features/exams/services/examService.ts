import { api } from "../../../api";
import { delay } from "../../enrollments/services/enrollmentService";
import type {
  ExamFilterType,
  ExamListType,
  ExamQueryType,
  ExamType,
  FormExam,
} from "../types";

export async function getExams(
  query: ExamQueryType,
  signal?: AbortSignal,
): Promise<ExamListType> {
  // console.log("before: getExams query:", query);
  const res = await api.get("exams", {
    params: {
      page: query.page,
      ...query.filtre,
    },
    signal,
  });

  await delay(500);
  return res.data;
}

export async function getExamDetails(id: string): Promise<ExamType> {
  const res = await api.get("exams/" + id);
  return res.data.data;
}

export async function getFilterOptions(): Promise<ExamFilterType> {
  const res = await api.get("exams/filter-options");
  return res.data;
}

export async function createExam(exam: FormExam) {
  const res = await api.post("exams", exam);
  return res;
}

export async function EditExam(exam: ExamType, data: FormExam) {
  const res = await api.patch("exams/" + exam.id, data);
  return res;
}

export async function deleteExam(exam: ExamType) {
  const res = await api.delete("exams/" + exam.id);
  return res;
}
