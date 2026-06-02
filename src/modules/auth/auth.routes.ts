import { Router } from "express";
import { login, signup } from "./auth.controller";
import { validateRequest } from "../../common/middlewares/validate.middleware";
import { loginSchema, signupSchema } from "./auth.validation";
import { authenticate } from "./auth.middleware";
import { authorize } from "../../common/middlewares/authorize.middleware";
import { ROLES } from "../../common/constants/roles";

const router = Router();
router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: (req as any).user,
  });
});

router.get(
  "/admin",

  authenticate,

  authorize(ROLES.ADMIN),

  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Admin",
    });

  }
);

export default router;
