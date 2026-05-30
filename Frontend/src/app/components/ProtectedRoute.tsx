import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../lib/auth";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
