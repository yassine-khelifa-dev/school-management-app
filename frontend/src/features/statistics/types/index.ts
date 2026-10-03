import type { AcademicYearsType } from "../../academicYears/types";
import type { SchoolClassType } from "../../schoolClasses/types";
import type { SubjectType } from "../../subjects/types";

//======== TopStudents

type SummaryStudentType = {
  student_id: number;
  full_name: string;
  average: number;
};
export type TopStudentsType = {
  subject: SubjectType;
  top_students: SummaryStudentType[];
};

//======== Filter

export type StatiscticsFilterOptionsType = {
  academic_years: AcademicYearsType[];
  classes: SchoolClassType[];
  subjects: SubjectType[];
};

//======== Query

export type StatiscticsQueryType = {
  school_class?: string;
  academic_year: string;
  subject?: string;
  limit?: number;
};

//======== OverView
type SummarySubjectType = {
  id: number;
  name: string;
  students_count: number;
  average: number;
  pass_count: number;
  fail_count: number;
  pass_rate: number;
};
export type SummaryOverViewType = {
  students_count: number;
  graded_records_count: number;
  global_average: number;
  subjects_total: number;
  subjects_passing: number;
  subjects_failing: number;
};
export type OverViewType = {
  summary: SummaryOverViewType;
  subjects: SummarySubjectType[];
};
