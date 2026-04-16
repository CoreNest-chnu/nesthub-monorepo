import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  const rounds = 10;
  const pepper = process.env.STATIC_SALT;

  if (!pepper) {
    throw new Error("STATIC_SALT is not defined");
  }

  return bcrypt.hash(password + pepper, rounds);
};

export const signToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
};
