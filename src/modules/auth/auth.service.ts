import bcrypt from "bcrypt";

import { AppError } from "../../common/errors/app-error";

import { createUser, findUserByEmail } from "./auth.repository";

import { SignupPayload } from "./auth.types";

export const signupUser = async (payload: SignupPayload) => {
  const existingUser = await findUserByEmail(payload.email);

  if (existingUser) {
    throw new AppError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await createUser({
    ...payload,
    password: hashedPassword,
  });

  return user;
};
