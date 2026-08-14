import { clearCart } from "../cart/cart.service";
import { getCartByUserIdRepository } from "../cart/cart.repository";
import { getProductsByIdsRepository } from "../product/product.repository";
import { createOrderRepository, getOrderByIdRepository, getOrdersByUserIdRepository, updateOrderStatusRepository } from "./order.repository";
import { AppError } from "../../common/errors/app-error";
import mongoose from "mongoose";

export const createOrder = async (
  userId: string,
  shippingAddress: any,
) => {
  // Get user's cart
  const cart = await getCartByUserIdRepository(userId);

  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  // Get all product ids from cart
  const productIds = cart.items.map((item) =>
    item.productId.toString(),
  );

  // Fetch all products
  const products = await getProductsByIdsRepository(productIds);

  // Create product lookup map
  const productMap = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ]),
  );

  // Build order snapshot
  const orderItems = cart.items.map((item) => {
    const product = productMap.get(
      item.productId.toString(),
    );

    if (!product) {
      throw new AppError(
        404,
        `Product ${item.productId} not found`,
      );
    }

    return {
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    };
  });

  // Calculate total
  const grandTotal = orderItems.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  // Create order
  const order = await createOrderRepository({
    userId,
    items: orderItems,
    grandTotal,
    shippingAddress,
  });

  // Clear user's cart
  await clearCart(userId);

  return order;
};

export const getMyOrders = async (
  userId: string,
) => {
  return getOrdersByUserIdRepository(userId);
};

export const getOrderById = async (
  orderId: string,
  userId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError(400, "Invalid order id");
  }

  const order =
    await getOrderByIdRepository(orderId);

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  // User can access only his own order
  if (order.userId !== userId) {
    throw new AppError(
      403,
      "You are not authorized to view this order",
    );
  }

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  orderStatus: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError(400, "Invalid order id");
  }

  const order =
    await getOrderByIdRepository(orderId);

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  return updateOrderStatusRepository(
    orderId,
    orderStatus,
  );
};