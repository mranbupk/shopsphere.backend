import { Request, Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/api-response";

import { loginUser, signupUser } from "./auth.service";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const user = await signupUser(req.body);

  sendResponse(res, 201, {
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const data = await loginUser(email, password);

  sendResponse(res, 200, {
    success: true,
    message: "Login successful",
    data,
  });
});
