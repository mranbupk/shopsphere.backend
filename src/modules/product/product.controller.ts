import { Response } from "express";

import { asyncHandler } from "../../common/utils/async-handler";
import { sendResponse } from "../../common/utils/api-response";
import {
    deleteProduct,
    getAllProducts,
    getMyProducts,
    getProductById,
    updateProduct,
} from "./product.service";
import { AuthenticatedRequest, JwtPayload } from "../auth/auth.types";

import { createProduct } from "./product.service";

export const createProductController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const product = await createProduct(req.body, req.user!.userId);

        sendResponse(res, 201, {
            success: true,
            message: "Product created successfully",
            data: product,
        });
    },
);

export const getProductsController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const { products, total } = await getAllProducts(
            req.query.search as string,
            req.query.category as string,
            page,
            limit,
        );

        const totalPages = Math.ceil(total / limit);

        sendResponse(res, 200, {
            success: true,
            message: "Products fetched successfully",

            data: products,

            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    },
);

export const getProductByIdController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const product = await getProductById(req.params.id as string);

        sendResponse(res, 200, {
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    },
);

export const getMyProductsController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const products = await getMyProducts(req.user!.userId);

        sendResponse(res, 200, {
            success: true,
            message: "My products fetched successfully",
            data: products,
        });
    },
);

export const updateProductController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        const updatedProduct = await updateProduct(
            req.params.id as string,
            req.body,
            req.user!,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    },
);

export const deleteProductController = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        await deleteProduct(req.params.id as string, req.user!);

        sendResponse(res, 200, {
            success: true,
            message: "Product deleted successfully",
        });
    },
);
