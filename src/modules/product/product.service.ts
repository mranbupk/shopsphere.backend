import mongoose from "mongoose";
import { AppError } from "../../common/errors/app-error";
import {
    countProductsRepository,
    createProductRepository,
    deleteProductRepository,
    getAllProductsRepository,
    getProductByIdRepository,
    getProductsByVendorRepository,
    updateProductRepository,
} from "./product.repository";

import { CreateProductPayload } from "./product.types";
import { JwtPayload } from "../auth/auth.types";

export const createProduct = async (
    payload: CreateProductPayload,
    createdBy: string,
) => {
    return createProductRepository(payload, createdBy);
};

export const getAllProducts = async (
    search?: string,
    category?: string,
    page = 1,
    limit = 10,
) => {
    const filter: Record<string, any> = {};

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    if (category) {
        filter.category = category;
    }

    const skip = (page - 1) * limit;

    const products = await getAllProductsRepository(filter, skip, limit);

    const total = await countProductsRepository(filter);

    return {
        products,
        total,
    };
};

export const getProductById = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(400, "Invalid product id");
    }

    const product = await getProductByIdRepository(id);

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    return product;
};

export const getMyProducts = async (userId: string) => {
    return getProductsByVendorRepository(userId);
};

export const updateProduct = async (
    productId: string,
    payload: Record<string, any>,
    user: JwtPayload,
) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError(400, "Invalid product id");
    }

    const product = await getProductByIdRepository(productId);

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    if (product.createdBy !== user.userId && user.role !== "ADMIN") {
        throw new AppError(403, "You cannot update this product");
    }

    const updatedProduct = await updateProductRepository(productId, payload);

    return updatedProduct;
};

export const deleteProduct = async (productId: string, user: JwtPayload) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError(400, "Invalid product id");
    }

    const product = await getProductByIdRepository(productId);

    if (!product) {
        throw new AppError(404, "Product not found");
    }

    if (product.createdBy !== user.userId && user.role !== "ADMIN") {
        throw new AppError(403, "You cannot delete this product");
    }

    await deleteProductRepository(productId);
};
