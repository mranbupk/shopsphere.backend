import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(2),

        description: z.string().min(10),

        price: z.number().positive(),

        category: z.string().min(2),

        stock: z.number().min(0),
    }),
});

export const updateProductSchema =
    z.object({
        body: z.object({
            name: z.string().min(2).optional(),

            description:
                z.string().min(10).optional(),

            price:
                z.number().positive().optional(),

            category:
                z.string().optional(),

            stock:
                z.number().min(0).optional(),
        }),
    });