export type LoginType = {
  email: string;
  password: string;
};

export type UserRole = "student" | "teacher" | "admin";

export type UserType = {
  user: {
    id: number;
    role: UserRole;
    email: string;
  };
  token: string;
};
