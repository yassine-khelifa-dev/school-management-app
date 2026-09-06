import z from "zod";
import type { EnrollmentType } from "../../enrollments/types";

export type StudentType = {
  id: number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email: string;
  enrollments_count?: number;
  enrollment?: EnrollmentType;
};

export type PaginateType = {
  current_page: number;
  last_page: number;
};

export type StudentListType = {
  data: StudentType[];
  meta: PaginateType;
};

export type StudentQueryType = {
  fullname?: string;
  dir?: "ASC" | "DESC";
  page?: number;
};

export type FormStudentInputs = {
  id: number;
  fullname?: string;
  email?: string;
  phone?: string;
};

export const CreateStudentSchema = z.object({
  first_name: z.string().min(3),
  last_name: z.string().min(3),
  email: z.email(),
  phone: z
    .string()
    .regex(/^\d+$/, "Phone must contain digits only")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must not exceed 15 digits"),
});

export type InputsCreateStudentValues = z.infer<typeof CreateStudentSchema>;
