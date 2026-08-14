import { Router } from "express";

import { authenticate } from "../auth/auth.middleware";
import { authorize } from "../../common/middlewares/authorize.middleware";
import { validateRequest } from "../../common/middlewares/validate.middleware";

import { ROLES } from "../../common/constants/roles";

import {
    createOrderController,
    getMyOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
} from "./order.controller";

import {
    createOrderSchema,
    updateOrderStatusSchema,
} from "./order.validation";

const router = Router();

// USER
router.post(
    "/",
    authenticate,
    authorize(ROLES.USER, ROLES.ADMIN),
    validateRequest(createOrderSchema),
    createOrderController,
);

router.get(
    "/",
    authenticate,
    authorize(ROLES.USER, ROLES.ADMIN),
    getMyOrdersController,
);

router.get(
    "/:id",
    authenticate,
    authorize(ROLES.USER, ROLES.ADMIN),
    getOrderByIdController,
);

// VENDOR / ADMIN
router.patch(
    "/:id/status",
    authenticate,
    authorize(ROLES.VENDOR, ROLES.ADMIN),
    validateRequest(updateOrderStatusSchema),
    updateOrderStatusController,
);

export default router;