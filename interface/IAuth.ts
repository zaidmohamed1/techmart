// Auth types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  token?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface IAuthResponse {
  message: string;
  user?: IUser;
  token?: string;
}
