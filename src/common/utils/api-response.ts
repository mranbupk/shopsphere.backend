import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  responseData: ApiResponse<T>
) => {

  return res.status(statusCode).json(responseData);

};