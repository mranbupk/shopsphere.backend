import { Router } from "express";
import { authenticate } from "../auth/auth.middleware";
import { authorize } from "../../common/middlewares/authorize.middleware";
import { ROLES } from "../../common/constants/roles";
import { validateRequest } from "../../common/middlewares/validate.middleware";
import { createProductSchema } from "./product.validation";
import { createProductController } from "./product.controller";

const router = Router();

router.post("/", authenticate, authorize(ROLES.VENDOR, ROLES.ADMIN), validateRequest(createProductSchema), createProductController);

export default router;