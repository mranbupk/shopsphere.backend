import { Router } from "express";
import { signup } from "./auth.controller";
import { validateRequest } from "../../common/middlewares/validate.middleware";
import { signupSchema } from "./auth.validation";

const router = Router();
router.post("/signup", validateRequest(signupSchema), signup);

export default router;
