import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const rounds = 10;
  const pepper = process.env.STATIC_SALT;

  if (!pepper) {
    throw new Error("STATIC_SALT is not defined");
  }

  return bcrypt.hash(password + pepper, rounds);
};
