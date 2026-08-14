import { z } from "zod";

export const createOrderSchema = z.object({
    body: z.object({
        shippingAddress: z.object({
            fullName: z.string().trim().min(1),
            phone: z.string().trim().min(10),
            address: z.string().trim().min(1),
            city: z.string().trim().min(1),
            state: z.string().trim().min(1),
            pincode: z.string().trim().min(1),
            country: z.string().trim().min(1),
        }),
    }),
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        orderStatus: z.enum([
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
        ]),
    }),
});