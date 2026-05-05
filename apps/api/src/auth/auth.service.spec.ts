import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { Role } from '../../generated/prisma/client'
import { AuthService } from './auth.service'

const mockCompare = mock()

mock.module('bcrypt', () => ({
  compare: (data: string, encrypted: string) => mockCompare(data, encrypted),
}))

mock.module('./util/auth.util', () => ({
  hashPassword: mock().mockResolvedValue('hashed'),
  signToken: mock().mockReturnValue('token'),
}))

const dbUser = {
  id: '1',
  email: 'test@test.com',
  password: 'hashed',
  role: Role.user,
  firstName: 'John',
  lastName: 'Doe',
  phone: null,
  avatar: null,
  birthDate: null,
  gender: null,
  updatedAt: new Date(),
  createdAt: new Date(),
}

let prisma: any
let service: AuthService

beforeEach(() => {
  prisma = {
    user: {
      findUnique: mock(),
      create: mock(),
      findFirst: mock(),
    },
  }

  service = new AuthService(prisma)

  process.env.STATIC_SALT = 'pepper'
})

afterEach(() => {
  delete process.env.STATIC_SALT
})

describe('AuthService', () => {
  describe('registerUser', () => {
    it('реєструє користувача і повертає токен', async () => {
      prisma.user.findUnique.mockResolvedValue(null)
      prisma.user.create.mockResolvedValue(dbUser)

      await expect(
        service.registerUser({
          email: 'test@test.com',
          password: '123',
          firstName: 'A',
          lastName: 'B',
        }),
      ).resolves.toEqual({ id: '1', token: 'token', role: Role.user })
    })

    it('кидає ConflictException якщо email вже зайнятий', async () => {
      prisma.user.findUnique.mockResolvedValue(dbUser)

      await expect(
        service.registerUser({
          email: 'test@test.com',
          password: '123',
          firstName: 'A',
          lastName: 'B',
        }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('loginUser', () => {
    it('логінить користувача і повертає токен', async () => {
      prisma.user.findFirst.mockResolvedValue(dbUser)
      mockCompare.mockResolvedValue(true)

      await expect(
        service.loginUser({ email: 'test@test.com', password: '123' }),
      ).resolves.toEqual({ id: '1', token: 'token', role: Role.user })
    })

    it('кидає UnauthorizedException якщо користувача немає', async () => {
      prisma.user.findFirst.mockResolvedValue(null)

      await expect(
        service.loginUser({ email: 'x@x.com', password: '123' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('кидає UnauthorizedException якщо пароль неправильний', async () => {
      prisma.user.findFirst.mockResolvedValue(dbUser)
      mockCompare.mockResolvedValue(false)

      await expect(
        service.loginUser({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException)
    })

    it('кидає помилку якщо STATIC_SALT не заданий', async () => {
      delete process.env.STATIC_SALT
      prisma.user.findFirst.mockResolvedValue(dbUser)

      await expect(
        service.loginUser({ email: 'test@test.com', password: '123' }),
      ).rejects.toThrow('STATIC_SALT is not defined')
    })
  })
})