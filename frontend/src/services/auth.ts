import { api } from "../api";
import type { LoginType, UserType } from "../types/user";

export default async function loginService(user: LoginType): Promise<UserType> {
  try {
    const response = await api.post("/login", user);
    return response.data;;
  } catch (error) {
    console.error(error);

    throw error;
  } finally {
    console.log("Request completed");
  }
}
