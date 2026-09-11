import type { AcademicYearsType } from "../../academicYears/types";
import type { SchoolClassType } from "../../schoolClasses/types";
import type { SubjectType } from "../../subjects/types";
import type { TeacherType } from "../../teachers/types";

export type ExamType = {
  id: number;
  title: string;
  exam_date: string;
  maximum_score: number;
  teaching_assignment_id: number;
  teacher: TeacherType;
  schoolClass: SchoolClassType;
  academicYear: AcademicYearsType;
  subject: SubjectType;
  grades_count: number;
};

export type PaginateType = {
  current_page: number;
  last_page: number;
};

export type ExamListType = {
  data: ExamType[];
  meta: PaginateType;
};

export type ExamQueryType = {
  page: number;
  filtre: {
    academic_year?: string;
    school_class?: string;
    subject?: string;
    q_field_sorted?: "title_exam" | "exam_date";
    q_dir_sorted?: string;
  };
};

export type ExamFilterType = {
  academicYers: AcademicYearsType[];
  subjects: SubjectType[];
  classes: SchoolClassType[];
};
