import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";

import type { ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("nexus_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      const usuario = {
        id: data.usuario.numeroCuenta,
        name: data.usuario.nombre,
        email: data.usuario.email,
        accountNumber: data.usuario.numeroCuenta,
        balance: data.usuario.saldo
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("nexus_user", JSON.stringify(usuario));

      setUser(usuario);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: name,
          email,
          password
        })
      });

      if (!response.ok) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexus_user");
    localStorage.removeItem("token");
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: newBalance
      };

      setUser(updatedUser);
      localStorage.setItem("nexus_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}