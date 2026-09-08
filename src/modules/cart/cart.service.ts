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

const buildCartResponse = async (cart: any): Promise<CartResponse> => {
  const productIds = cart.items.map((item: any) =>
    item.productId.toString(),
  );

  if (productIds.length === 0) {
    return {
      items: [],
      grandTotal: 0,
    };
  }

  const products = await getProductsByIdsRepository(productIds);

  // Remove deleted products
  const validProductIds = new Set(
    products.map((product) => product._id.toString()),
  );

  cart.items = cart.items.filter((item: any) =>
    validProductIds.has(item.productId.toString()),
  );

  if (cart.items.length !== productIds.length) {
    await cart.save();
  }

  // Faster lookup than Array.find()
  const productMap = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  const items: CartItemResponse[] = cart.items.map((item: any) => {
    const product = productMap.get(item.productId.toString())!;

    return {
      productId: product._id.toString(),
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    };
  });

  const grandTotal = items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  return {
    items,
    grandTotal,
  };
};

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

  // Check requested quantity against stock
  if (quantity > existingProduct.stock) {
    throw new AppError(
      400,
      `Only ${existingProduct.stock} items are available`,
    );
  }

  // Find user's cart
  const cart = await getCartByUserIdRepository(userId);

  // Create cart if it doesn't exist
  if (!cart) {
    const newCart = await createCartRepository({
      userId,
      items: [
        {
          productId,
          quantity,
        },
      ],
    });

    return buildCartResponse(newCart);
  }

  // Check whether product already exists
  const existingItem = cart.items.find((item) =>
    item.productId.equals(productId),
  );

  // Calculate final quantity
  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  // Check final quantity against stock
  if (newQuantity > existingProduct.stock) {
    throw new AppError(
      400,
      `Only ${existingProduct.stock} items are available`,
    );
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
    });
  }

  await cart.save();

  return buildCartResponse(cart);
};

export const getCart = async (
  userId: string,
): Promise<CartResponse> => {
  const cart = await getCartByUserIdRepository(userId);

  if (!cart) {
    return {
      items: [],
      grandTotal: 0,
    };
  }

  return buildCartResponse(cart);
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

  // Check product exists
  const product = await getProductByIdRepository(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  // Check requested quantity against stock
  if (quantity > product.stock) {
    throw new AppError(
      400,
      `Only ${product.stock} items are available`,
    );
  }

  existingItem.quantity = quantity;

  await cart.save();

  return buildCartResponse(cart);
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

  return buildCartResponse(cart);
};

export const clearCart = async (userId: string) => {
  const cart = await getCartByUserIdRepository(userId);

  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  await deleteCartRepository(userId);
};