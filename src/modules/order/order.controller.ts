import { Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/api-response";

import { AuthenticatedRequest } from "../auth/auth.types";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
} from "./order.service";

export const createOrderController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const order = await createOrder(
            req.user!.userId,
            req.body.shippingAddress,
        );

        sendResponse(res, 201, {
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    },
);

export const getMyOrdersController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const orders = await getMyOrders(
            req.user!.userId,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Orders fetched successfully",
            data: orders,
        });
    },
);

export const getOrderByIdController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const order = await getOrderById(
            req.params.id as string,
            req.user!.userId,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    },
);

export const updateOrderStatusController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const order = await updateOrderStatus(
            req.params.id as string,
            req.body.orderStatus,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    },
);