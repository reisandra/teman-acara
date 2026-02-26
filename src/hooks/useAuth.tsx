// src/hooks/useAuth.ts

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- Bagian ini menciptakan AuthContext ---
// Ini bukan file, melainkan variabel yang menampung data autentikasi.
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Di sinilah "AuthContext" dibuat.
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// -------------------------------------------------

// --- Bagian ini adalah Provider yang akan membungkus aplikasi ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
// -------------------------------------------------------------

// --- Bagian ini adalah hook yang akan Anda gunakan di komponen lain ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
// --------------------------------------------------------------------