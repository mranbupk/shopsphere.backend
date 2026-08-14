import { Order } from "./order.model";

export const createOrderRepository = async (payload: any) => {
    return Order.create(payload);
};

export const getOrdersByUserIdRepository = async (
    userId: string,
) => {
    return Order.find({ userId }).sort({
        createdAt: -1,
    });
};

export const getOrderByIdRepository = async (
    orderId: string,
) => {
    return Order.findById(orderId);
};

export const updateOrderStatusRepository = async (
    orderId: string,
    orderStatus: string,
) => {
    return Order.findByIdAndUpdate(
        orderId,
        {
            orderStatus,
        },
        {
            new: true,
        },
    );
};