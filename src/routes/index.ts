import { Router } from "express";
import healthRouter from "../modules/health/health.routes";
import authRouter from "../modules/auth/auth.routes";
import productRouter from "../modules/product/product.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter);

export default router;
