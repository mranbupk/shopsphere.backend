import {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../errors/app-error";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  next(
    new AppError(
      404,
      `Route ${req.originalUrl} not found`
    )
  );

};