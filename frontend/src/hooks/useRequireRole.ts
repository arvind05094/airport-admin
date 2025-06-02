import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function useRequireRole(roles: string[]) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!roles.includes(user.role)) {
      navigate("/unauthorized");
    }
  }, [user, navigate, roles]);

  return user;
}
