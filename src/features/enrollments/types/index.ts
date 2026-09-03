import * as z from "zod";
export type EnrollmentType = {
  id: number;
  schoolClass: {
    id: number;
    name: string;
  };
  student: {
    id: number;
    full_name: string;
    last_name: string;
    first_name: string;
    email: string;
    phone: string;
  };
  academicYear: {
    id: number;
    name: string;
    starts_at: string;
    ends_at: string;
  };
  status: string;
  enrolled_at: string;
};

export type EnrollmentListType = {
  data: EnrollmentType[];
  meta: {
    current_page: number;
    last_page: number;
  };
};

export const EnrollmentFormSchema = z.object({
  student_id: z.number(),
  class_id: z.number(),
  academic_year_id: z.number(),
  enrolled_at: z.string(),
  status: z.string(),
});

export type EnrollmentFormType = z.infer<typeof EnrollmentFormSchema>;

export type EnrollQueryType = {
  page?: number;
  filter?: {
    status?: string;
    search?: string;
    academicYearSelected?: string;
    schoolClassesSelected?: string;
  };
};
