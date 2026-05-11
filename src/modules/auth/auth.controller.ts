import { Request, Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/api-response";

import { signupUser } from "./auth.service";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const user = await signupUser(req.body);

  sendResponse(res, 201, {
    success: true,
    message: "User registered successfully",
    data: user,
  });
});
