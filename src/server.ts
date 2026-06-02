import app from "./app";
import { config } from "./config";

import "./database/postgres";

import { connectMongoDB }
  from "./database/mongo";

const startServer = async () => {

  await connectMongoDB();

  app.listen(
    config.port,
    () => {
      console.log(
        `Server running on port ${config.port}`
      );
    }
  );
};

startServer();