import { Router } from "express";

import { authenticate } from "../auth/auth.middleware";
import { validateRequest } from "../../common/middlewares/validate.middleware";

import { addToCartSchema, removeCartItemSchema, updateCartItemSchema } from "./cart.validation";

import { addToCartController, clearCartController, getCartController, removeCartItemController, updateCartItemController } from "./cart.controller";

const router = Router();

router.post(
  "/items",
  authenticate,
  validateRequest(addToCartSchema),
  addToCartController,
);

router.get("/", authenticate, getCartController);

router.patch(
    "/items/:productId",
    authenticate,
    validateRequest(updateCartItemSchema),
    updateCartItemController,
);

router.delete(
    "/items/:productId",
    authenticate,
    validateRequest(removeCartItemSchema),
    removeCartItemController,
);

router.delete(
    "/",
    authenticate,
    clearCartController,
);

export default router;

