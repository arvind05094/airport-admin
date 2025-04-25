export interface AuthResponse {
  token: string
  fullName: string
  email: string
  role: string
}

export interface DecodedToken {
  nameid: string
  email: string
  role: string
  exp: number
}
