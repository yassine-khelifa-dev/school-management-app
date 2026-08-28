export type LoginType = {
  email: string;
  password: string;
};

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export type UserType = {
  user: {
    id: number;
    role: UserRole;
    email: string;
  };
  token: string;
};
