import mongoose from "mongoose";
import {
  getProductByIdRepository,
  getProductsByIdsRepository,
} from "../product/product.repository";
import {
  createCartRepository,
  deleteCartRepository,
  getCartByUserIdRepository,
} from "./cart.repository";
import { AppError } from "../../common/errors/app-error";
import { CartItemResponse, CartResponse } from "./cart.types";

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  // Validate ProductId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(400, "Invalid product id");
  }

  // Check product exists
  const existingProduct = await getProductByIdRepository(productId);

  if (!existingProduct) {
    throw new AppError(404, "Product not found");
  }

  // Find user's cart
  const cart = await getCartByUserIdRepository(userId);

  // Create cart if it doesn't exist
  if (!cart) {
    return createCartRepository({
      userId,
      items: [
        {
          productId,
          quantity,
        },
      ],
    });
  }

  // Check whether product already exists
  const existingItem = cart.items.find((item) =>
    item.productId.equals(productId),
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
    });
  }

  await cart.save();

  return cart;
};

export const getCart = async (userId: string): Promise<CartResponse> => {
  const cart = await getCartByUserIdRepository(userId);

  if (!cart) {
    return {
      items: [],
      grandTotal: 0,
    };
  }

  const productIds = cart.items.map((item) => item.productId.toString());

  const products = await getProductsByIdsRepository(productIds);

  const items: CartItemResponse[] = cart.items
    .map((item) => {
      const product = products.find(
        (product) => product._id.toString() === item.productId.toString(),
      );

      if (!product) {
        return null;
      }

      return {
        productId: product._id.toString(),
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    })
    .filter((item): item is CartItemResponse => item !== null);

  const grandTotal = items.reduce((total, item) => total + item.subtotal, 0);

  return {
    items,
    grandTotal,
  };
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(400, "Invalid product id");
  }

  const cart = await getCartByUserIdRepository(userId);

  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  const existingItem = cart.items.find((item) =>
    item.productId.equals(productId),
  );

  if (!existingItem) {
    throw new AppError(404, "Product not found in cart");
  }

  existingItem.quantity = quantity;

  await cart.save();

  return cart;
};

export const removeCartItem = async (
    userId: string,
    productId: string,
) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError(400, "Invalid product id");
    }

    const cart = await getCartByUserIdRepository(userId);

    if (!cart) {
        throw new AppError(404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex((item) =>
        item.productId.equals(productId),
    );

    if (itemIndex === -1) {
        throw new AppError(404, "Product not found in cart");
    }

    cart.items.splice(itemIndex, 1);

    await cart.save();

    return cart;
};

export const clearCart = async (userId: string) => {
    const cart = await getCartByUserIdRepository(userId);

    if (!cart) {
        throw new AppError(404, "Cart not found");
    }

    await deleteCartRepository(userId);
};