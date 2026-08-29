export type StudentType = {
  id: number;
  full_name: string;
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
