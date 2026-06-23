import { Product } from "./product.model";

import { CreateProductPayload } from "./product.types";

export const createProductRepository = async (
  payload: CreateProductPayload,
  createdBy: string,
) => {
  return Product.create({
    ...payload,
    createdBy,
  });
};

export const getAllProductsRepository = async (
  filter: Record<string, any>,
  skip: number,
  limit: number,
) => {
  return Product.find(filter).skip(skip).limit(limit);
};

export const getProductByIdRepository = async (id: string) => {
  return Product.findById(id);
};

export const countProductsRepository = async (filter: Record<string, any>) => {
  return Product.countDocuments(filter);
};

export const getProductsByVendorRepository = async (userId: string) => {
  return Product.find({
    createdBy: userId,
  });
};

export const updateProductRepository = async (
  productId: string,
  payload: Record<string, any>,
) => {
  return Product.findByIdAndUpdate(productId, payload, {
    new: true,
  });
};

export const deleteProductRepository = async (productId: string) => {
  return Product.findByIdAndDelete(productId);
};
