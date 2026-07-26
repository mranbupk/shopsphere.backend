import { Cart } from "./cart.model";

export const createCartRepository = async (
    cartData: Record<string, any>,
) => {
    return Cart.create(cartData);
};

export const getCartByUserIdRepository = async (
    userId: string,
) => {
    return Cart.findOne({ userId });
};

export const deleteCartRepository = async (
    userId: string,
) => {
    return Cart.findOneAndDelete({ userId });
};