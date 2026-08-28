import { createContext, useContext, useState } from "react";
import type { UserType } from "../types/user";

type UserContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
};

type Props = {
  children: React.ReactNode;
};

export const UserContext = createContext<UserContextType | null>(null);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }

    return null;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside AuthProvider");
  }

  return context;
};
