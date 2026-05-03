import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface UserContextValue {
  username: string;
  setUsername: (name: string) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsernameState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("north_username");
      return saved || "Guest";
    } catch {
      return "Guest";
    }
  });

  useEffect(() => {
    localStorage.setItem("north_username", username);
  }, [username]);

  const setUsername = (name: string) => {
    setUsernameState(name || "Guest");
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
