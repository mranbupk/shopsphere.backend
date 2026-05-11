import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes";
import { globalErrorHandler } from "./common/middlewares/error.middleware";
import { notFoundHandler } from "./common/middlewares/not-found.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1", routes);

app.use(notFoundHandler)
app.use(globalErrorHandler)

export default app;