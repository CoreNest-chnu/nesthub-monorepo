const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export const jwtConfig = {
  secret: jwtSecret,
  signOptions: {
    expiresIn: jwtExpiresIn,
  },
};
