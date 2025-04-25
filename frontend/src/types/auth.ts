export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
}

export interface UserInfo {
  id: string;
  email: string;
  role: string;
  exp: number;
}
