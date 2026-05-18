import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/errors/app-error";
import { verifyToken } from "../../common/utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, "Authorization token missing");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError(401, "Invalid authorization format");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError(401, "Invalid or expired token"));
  }
};
