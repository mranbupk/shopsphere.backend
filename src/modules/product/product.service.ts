import { Product } from "./product.model";

import { CreateProductPayload } from "./product.types";

export const createProduct = async (
    payload: CreateProductPayload,
    createdBy: string
) => {

    const product = await Product.create({
        ...payload,

        createdBy,
    });

    return product;
};