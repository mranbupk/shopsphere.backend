import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { authorize } from "../../common/middlewares/authorize.middleware";
import { ROLES } from "../../common/constants/roles";
import { validateRequest } from "../../common/middlewares/validate.middleware";
import { createProductSchema, updateProductSchema } from "./product.validation";
import { createProductController, deleteProductController, getMyProductsController, getProductByIdController, updateProductController } from "./product.controller";
import { getProductsController } from "./product.controller";

const router = Router();

router.post("/", authenticate, authorize(ROLES.VENDOR, ROLES.ADMIN), validateRequest(createProductSchema), createProductController);
router.get("/", getProductsController);
router.get("/my-products", authenticate, authorize(ROLES.VENDOR, ROLES.ADMIN), getMyProductsController);
router.get("/:id", getProductByIdController);
router.put("/:id", authenticate, authorize(ROLES.VENDOR, ROLES.ADMIN), validateRequest(updateProductSchema), updateProductController);
router.delete("/:id", authenticate, authorize(ROLES.VENDOR, ROLES.ADMIN), deleteProductController);

export default router;