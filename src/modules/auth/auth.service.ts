import bcrypt from "bcrypt";
import { AppError } from "../../common/errors/app-error";
import { createUser, findUserByEmail } from "./auth.repository";
import { SignupPayload } from "./auth.types";
import { generateToken } from "../../common/utils/jwt";

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

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,

    email: user.email,

    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
