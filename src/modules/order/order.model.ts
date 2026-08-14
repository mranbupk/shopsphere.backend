import { Schema, model, Types } from "mongoose";

export interface OrderItem {
    productId: Types.ObjectId;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface Order {
    userId: string;
    items: OrderItem[];
    grandTotal: number;
    shippingAddress: ShippingAddress;
    orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        subtotal: {
            type: Number,
            required: true,
        },
    },
    {
        _id: false,
    },
);

const ShippingAddressSchema = new Schema<ShippingAddress>(
    {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
    },
    {
        _id: false,
    },
);

const OrderSchema = new Schema<Order>(
    {
        userId: {
            type: String,
            required: true,
        },

        items: {
            type: [OrderItemSchema],
            required: true,
        },

        grandTotal: {
            type: Number,
            required: true,
        },

        shippingAddress: {
            type: ShippingAddressSchema,
            required: true,
        },

        orderStatus: {
            type: String,
            enum: [
                "PENDING",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "PENDING",
        },

        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "SUCCESS",
                "FAILED",
            ],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    },
);

export const Order = model<Order>(
    "Order",
    OrderSchema,
);