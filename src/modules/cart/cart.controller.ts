import { Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/api-response";

import { AuthenticatedRequest } from "../auth/auth.types";

import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "./cart.service";

export const addToCartController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { productId, quantity } = req.body;

        const cart = await addToCart(
            req.user!.userId as string,
            productId,
            quantity,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Product added to cart successfully",
            data: cart,
        });
    },
);

export const getCartController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const cart = await getCart(req.user!.userId);

        sendResponse(res, 200, {
            success: true,
            message: "Cart fetched successfully",
            data: cart,
        });
    },
);

export const updateCartItemController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const { quantity } = req.body;

        const cart = await updateCartItem(
            req.user!.userId,
            req.params.productId as string,
            quantity,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Cart updated successfully",
            data: cart,
        });
    },
);

export const removeCartItemController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const cart = await removeCartItem(
            req.user!.userId,
            req.params.productId as string,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Product removed from cart successfully",
            data: cart,
        });
    },
);

export const clearCartController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await clearCart(req.user!.userId);

        sendResponse(res, 200, {
            success: true,
            message: "Cart cleared successfully",
        });
    },
);

