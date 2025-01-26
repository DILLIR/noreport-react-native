import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/appwrite";
import { UsersDocument } from "../types/schema";

interface GlobalContextType {
  user: UsersDocument | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: UsersDocument | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UsersDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setUser(user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{ user, isLoggedIn, setUser, setIsLoggedIn, isLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
