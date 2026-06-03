import { Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/api-response";

import {
    AuthenticatedRequest,
} from "../auth/auth.types";

import { createProduct } from "./product.service";

export const createProductController =
    asyncHandler(
        async (
            req: AuthenticatedRequest,
            res: Response
        ) => {

            const product =
                await createProduct(
                    req.body,
                    req.user!.userId
                );

            sendResponse(res, 201, {
                success: true,
                message: "Product created successfully",
                data: product,
            });

        }
    );