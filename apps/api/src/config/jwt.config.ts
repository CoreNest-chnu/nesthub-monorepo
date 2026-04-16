import { StringValue } from 'ms'

export const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as StringValue },
}
