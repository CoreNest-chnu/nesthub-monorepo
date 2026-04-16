import * as bcrypt from "bcrypt";

async function hashPassword(password: string, salt: string) {
  const saltyPassword = password + process.env.STATIC_SALT;

  const hashedPassword = await bcrypt.hash(saltyPassword, salt);

  return hashedPassword;
}

async function generateSalt() {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  return salt;
}

export { generateSalt, hashPassword };
