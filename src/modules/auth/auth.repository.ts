import { postgresPool } from "../../database/postgres";

import { SignupPayload } from "./auth.types";

export const findUserByEmail = async (email: string) => {
  const query = `
    SELECT * FROM users
    WHERE email = $1
  `;

  const result = await postgresPool.query(query, [email]);

  return result.rows[0];
};

export const createUser = async (payload: SignupPayload) => {
  const query = `
    INSERT INTO users (
      name,
      email,
      password
    )
    VALUES ($1, $2, $3)
    RETURNING id, name, email, role, created_at
  `;

  const values = [payload.name, payload.email, payload.password];

  const result = await postgresPool.query(query, values);

  return result.rows[0];
};
