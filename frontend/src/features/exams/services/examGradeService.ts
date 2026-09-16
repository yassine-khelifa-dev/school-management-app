import { api } from "../../../api";
import type { ExamGradeType, GradesFormType, GradeType } from "../types";

export async function getExamGrades(
  exam_id: string,
  signal?: AbortSignal,
): Promise<ExamGradeType> {
  const res = await api.get("exam/" + exam_id + "/grades", {
    signal,
  });

  const data = res.data;

  data.data = data.data.map((row: GradeType) => ({
    ...row,
    grade: {
      ...row.grade,
      score: row.grade.score === null ? null : Number(row.grade.score),
    },
  }));

  return data;
}

export async function updateExamGrades(
  exam_id: string,
  data: GradesFormType,
  signal?: AbortSignal,
) {
  const res = await api.patch("exam/" + exam_id + "/grades", data, {
    signal,
  });
  return res;
}

export async function deleteGrade(
  exam_id: number,
  grade_id: number,
  signal?: AbortSignal,
) {
  const res = await api.delete("exam/" + exam_id + "/grades/" + grade_id, {
    signal,
  });
  return res;
}
