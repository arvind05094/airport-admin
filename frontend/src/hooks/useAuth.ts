import { useEffect, useState } from "react";

export interface UserInfo {
  id: string;
  email: string;
  role: string;
  exp: number;
}

function parseJwt(token: string): UserInfo | null {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return {
      id: decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      email:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],
      role: decoded[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ],
      exp: decoded.exp,
    };
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    const decoded = parseJwt(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      setUser(null);
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
