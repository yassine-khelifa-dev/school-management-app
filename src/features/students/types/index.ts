export type StudentType = {
  id: number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email: string;
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
