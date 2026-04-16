import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Role, UserId } from 'generated/prisma/types'

type SignTokenArgs = {
  id: UserId
  email: string
  role: Role
}

export const hashPassword = async (password: string): Promise<string> => {
  const rounds = 10
  const pepper = process.env.STATIC_SALT

  if (!pepper) {
    throw new Error('STATIC_SALT is not defined')
  }

  return await bcrypt.hash(password + pepper, rounds)
}

export const signToken = (payload: SignTokenArgs): string => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  return jwt.sign(payload, secret, { expiresIn: '7d' })
}
