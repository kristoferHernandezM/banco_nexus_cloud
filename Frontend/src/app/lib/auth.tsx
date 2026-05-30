import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

    const existingUsers = localStorage.getItem("nexus_users");
    if (!existingUsers) {
      const demoUsers = [
        {
          id: "demo1",
          name: "Ana García",
          email: "ana@demo.com",
          password: "demo123",
          accountNumber: "1234567890",
          balance: 75000.00,
        },
        {
          id: "demo2",
          name: "Carlos Rodríguez",
          email: "carlos@demo.com",
          password: "demo123",
          accountNumber: "0987654321",
          balance: 120000.00,
        },
      ];
      localStorage.setItem("nexus_users", JSON.stringify(demoUsers));

      const demoAccounts = [
        {
          id: "acc1",
          alias: "Cuenta de Ahorros",
          accountNumber: "5555555555",
          bankName: "Banco Nacional",
          createdAt: new Date().toISOString(),
        },
        {
          id: "acc2",
          alias: "Nómina Empresa",
          accountNumber: "6666666666",
          bankName: "Banco Empresarial",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("nexus_saved_accounts", JSON.stringify(demoAccounts));

      const demoTransactions = [
        {
          id: "tx1",
          fromAccount: "1234567890",
          toAccount: "5555555555",
          amount: 5000,
          concept: "Ahorro mensual",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: "completed",
        },
        {
          id: "tx2",
          fromAccount: "0987654321",
          toAccount: "1234567890",
          amount: 12000,
          concept: "Pago de servicios profesionales",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: "completed",
        },
      ];
      localStorage.setItem("nexus_transactions", JSON.stringify(demoTransactions));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("nexus_users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("nexus_user", JSON.stringify(userWithoutPassword));

      const auditLog = JSON.parse(localStorage.getItem("nexus_audit") || "[]");
      auditLog.unshift({
        id: Date.now().toString(),
        type: "login_success",
        description: "Inicio de sesión exitoso",
        timestamp: new Date().toISOString(),
        status: "success",
      });
      localStorage.setItem("nexus_audit", JSON.stringify(auditLog));

      return true;
    }

    const auditLog = JSON.parse(localStorage.getItem("nexus_audit") || "[]");
    auditLog.unshift({
      id: Date.now().toString(),
      type: "login_failed",
      description: `Intento de inicio de sesión fallido para ${email}`,
      timestamp: new Date().toISOString(),
      status: "error",
    });
    localStorage.setItem("nexus_audit", JSON.stringify(auditLog));

    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("nexus_users") || "[]");

    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      accountNumber,
      balance: 50000.00,
    };

    users.push(newUser);
    localStorage.setItem("nexus_users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("nexus_user", JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nexus_user");
  };

  const updateBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("nexus_user", JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem("nexus_users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], balance: newBalance };
        localStorage.setItem("nexus_users", JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateBalance }}>
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
