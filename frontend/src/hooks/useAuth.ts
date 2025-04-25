import { useEffect, useState } from "react";
import type { DecodedToken } from "../types/auth";

function parseJwt(token: string): DecodedToken | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<DecodedToken | null | undefined>(undefined);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = parseJwt(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return;
    }
    setUser(decoded);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return { user, logout };
}
