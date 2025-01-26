import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";
import { UsersDocument, UsersType } from "../types/schema";

interface GlobalContextType {
  user?: any;
  isLoggedIn?: boolean;
  setUser?: any;
  setIsLoggedIn?: any;
  isLoading?: boolean;
}

const GlobalContext = createContext<GlobalContextType>({});

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UsersType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    getCurrentUser()
      .then((user) => {
        if (user) {
          setUser(user as UsersDocument);
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
