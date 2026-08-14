import { Router } from "express";
import healthRouter from "../modules/health/health.routes";
import authRouter from "../modules/auth/auth.routes";
import productRouter from "../modules/product/product.routes";
import cartRouter from "../modules/cart/cart.routes";
import orderRouter from "../modules/order/order.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);

export default router;
