import {
    NextFunction,
    Request,
    Response,
} from "express";

import { ZodSchema } from "zod";

export const validateRequest =
    (schema: ZodSchema) =>
        (
            req: Request,
            res: Response,
            next: NextFunction
        ) => {

            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });

            if (!result.success) {

                const errors = result.error.issues.map(
                    (issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })
                );

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors,
                });

            }
            next();
        };