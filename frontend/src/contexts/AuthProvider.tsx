import { useState } from "react";
import { UserContext } from "./UserContext";

type Props = {
  children: React.ReactNode;
};

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
