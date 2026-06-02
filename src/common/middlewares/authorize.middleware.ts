import { NextFunction, Response } from "express";
import { AppError } from "../errors/app-error";
import { AuthenticatedRequest } from "../../modules/auth/auth.types";

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(new AppError(403, "Access denied"));
    }

    next();
  };
};
