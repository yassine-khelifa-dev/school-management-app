import { api } from "../api";
import type { LoginType, UserType } from "../types/user";

export default async function loginService(user: LoginType): Promise<UserType> {
  const response = await api.post("/login", user);
  return response.data;
}
