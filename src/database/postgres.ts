import { Pool } from "pg";

import { config } from "../config";

export const postgresPool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
});

postgresPool
  .connect()
  .then((client) => {
    console.log("PostgreSQL connected successfully");

    client.release();
  })
  .catch((error) => {
    console.error("PostgreSQL connection failed", error);
  });
