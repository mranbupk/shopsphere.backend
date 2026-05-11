import { Request, Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/api-response";

import { AppError } from "../../common/errors/app-error";

import { getHealthStatus } from "./health.service";

export const healthCheck = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    // throw new AppError(
    //   404,
    //   "Health route not found"
    // );

    const response = getHealthStatus();

    sendResponse(res, 200, {
      success: true,
      message: "Health check successful",
      data: response,
    });

  }
);