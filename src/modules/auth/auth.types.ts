import { Request } from "express";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
