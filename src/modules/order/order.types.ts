export interface OrderItemResponse {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface OrderResponse {
    id: string;
    userId: string;
    items: OrderItemResponse[];
    grandTotal: number;
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    orderStatus: string;
    paymentStatus: string;
    createdAt: Date;
}