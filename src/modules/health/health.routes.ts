import { Router } from "express";
import { healthCheck } from "./health.controller";
import { validateRequest } from "../../common/middlewares/validate.middleware";
import { healthQuerySchema } from "./health.validation";

const healthRouter = Router();

healthRouter.get("/", validateRequest(healthQuerySchema), healthCheck);

export default healthRouter;