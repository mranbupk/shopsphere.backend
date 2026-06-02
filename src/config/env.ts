import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),

  NODE_ENV: z
    .enum([
      "development",
      "production",
      "test",
    ])
    .default("development"),

  JWT_SECRET: z
    .string()
    .min(1, "JWT_SECRET is required"),
  DB_HOST: z.string(),

  DB_PORT: z.string(),

  DB_USER: z.string(),

  DB_PASSWORD: z.string(),

  DB_NAME: z.string(),

  JWT_EXPIRES_IN: z.string(),
  MONGO_URI: z.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {

  console.error(
    "Invalid environment variables:",
    parsedEnv.error.format()
  );

  process.exit(1);

}

export const env = parsedEnv.data;