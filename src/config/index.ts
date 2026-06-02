import { env } from "./env";

export const config = {
    port: env.PORT,

    nodeEnv: env.NODE_ENV,

    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: env.JWT_EXPIRES_IN,
    },
    database: {
        host: env.DB_HOST,
        port: Number(env.DB_PORT),
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
    },
    mongo: {
        uri: env.MONGO_URI,
    },
};