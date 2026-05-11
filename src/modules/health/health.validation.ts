import { z } from "zod";

export const healthQuerySchema = z.object({
  query: z.object({
    name: z.string().min(1, "Name is required"),
  }),
});