// Auth types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
  token?: string;
}
