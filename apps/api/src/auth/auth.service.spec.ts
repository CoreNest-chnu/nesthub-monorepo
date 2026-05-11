import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { Role } from '../../generated/prisma/client'
import { AuthService } from './auth.service'

const mockCompare = jest.fn<Promise<boolean>, [string, string]>()

jest.mock('bcrypt', () => ({
  compare: (data: string, encrypted: string) => mockCompare(data, encrypted),
}))

jest.mock('./util/auth.util', () => ({
  hashPassword: jest.fn().mockResolvedValue('hashed'),
  signToken: jest.fn().mockReturnValue('token'),
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

type PrismaMock = {
  user: {
    findUnique: jest.Mock
    create: jest.Mock
    findFirst: jest.Mock
  }
}

let prisma: PrismaMock
let service: AuthService

beforeEach(() => {
  prisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  service = new AuthService(prisma as unknown as PrismaService)

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
        service.create({
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
        service.create({
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
