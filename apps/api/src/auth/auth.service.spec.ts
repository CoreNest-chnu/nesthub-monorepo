import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { mockDeep, type DeepMockProxy } from 'jest-mock-extended'
import { type PrismaClient, Role } from '../../generated/prisma/client'
import { AuthService } from './auth.service'

const mockCompare = jest.fn<Promise<boolean>, [string, string]>()

jest.mock('prisma/lib/prisma')
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

let prisma: DeepMockProxy<PrismaClient>
let service: AuthService

beforeEach(() => {
  prisma = mockDeep<PrismaClient>()
  service = new AuthService(prisma)
  jest.clearAllMocks()
})

describe('registerUser', () => {
  it('реєструє користувача і повертає токен', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue(dbUser)

    await expect(
      service.registerUser({
        email: 'Test@Test.com',
        password: '123',
        firstName: 'A',
        lastName: 'B',
      }),
    ).resolves.toEqual({ id: '1', token: 'token', role: Role.user })
  })

  it('кидає ConflictException якщо email зайнятий', async () => {
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
  beforeEach(() => {
    process.env.STATIC_SALT = 'pepper'
  })
  afterEach(() => {
    delete process.env.STATIC_SALT
  })

  it('логінить користувача і повертає токен', async () => {
    prisma.user.findFirst.mockResolvedValue(dbUser)
    mockCompare.mockResolvedValue(true)

    await expect(
      service.loginUser({ email: 'test@test.com', password: '123' }),
    ).resolves.toEqual({ id: '1', token: 'token', role: Role.user })
  })

  it('кидає UnauthorizedException якщо юзера не існує', async () => {
    prisma.user.findFirst.mockResolvedValue(null)

    await expect(
      service.loginUser({ email: 'x@x.com', password: '123' }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('кидає UnauthorizedException якщо пароль невірний', async () => {
    prisma.user.findFirst.mockResolvedValue(dbUser)
    mockCompare.mockResolvedValue(false)

    await expect(
      service.loginUser({ email: 'test@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('кидає Error якщо STATIC_SALT не задано', async () => {
    delete process.env.STATIC_SALT
    prisma.user.findFirst.mockResolvedValue(dbUser)

    await expect(
      service.loginUser({ email: 'test@test.com', password: '123' }),
    ).rejects.toThrow('STATIC_SALT is not defined')
  })
})
