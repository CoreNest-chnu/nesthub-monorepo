import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { Role } from '../../generated/prisma/client'

const mockCompare = mock()

mock.module('bcrypt', () => ({
  compare: (a: string, b: string) => mockCompare(a, b),
}))

mock.module('./util/auth.util', () => ({
  hashPassword: mock().mockResolvedValue('hashed'),
  signToken: mock().mockReturnValue('token'),
}))

type User = {
  id: string
  email: string
  password: string
  role: Role
}

describe('AuthService', () => {
  let prisma: {
    user: {
      findUnique: ReturnType<typeof mock>
      create: ReturnType<typeof mock>
      findFirst: ReturnType<typeof mock>
    }
  }

  let service: {
    registerUser: (data: Record<string, unknown>) => Promise<unknown>
    loginUser: (data: Record<string, unknown>) => Promise<unknown>
  }

  const dbUser: User = {
    id: '1',
    email: 'test@test.com',
    password: 'hashed',
    role: Role.user,
  }

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: mock(),
        create: mock(),
        findFirst: mock(),
      },
    }

    const { AuthService } = require('./auth.service')
    service = new AuthService(prisma)
    process.env.STATIC_SALT = 'pepper'
  })

  it('register user', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockResolvedValue(dbUser)

    const res = await service.registerUser({
      email: 'test@test.com',
      password: '123',
      firstName: 'A',
      lastName: 'B',
    })

    expect(res).toEqual({
      id: '1',
      token: 'token',
      role: Role.user,
    })
  })

  it('email already exists', async () => {
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

  it('login success', async () => {
    prisma.user.findFirst.mockResolvedValue(dbUser)
    mockCompare.mockResolvedValue(true)

    const res = await service.loginUser({
      email: 'test@test.com',
      password: '123',
    })

    expect(res.id).toBe('1')
    expect(res.token).toBe('token')
  })

  it('wrong password', async () => {
    prisma.user.findFirst.mockResolvedValue(dbUser)
    mockCompare.mockResolvedValue(false)

    await expect(
      service.loginUser({
        email: 'test@test.com',
        password: 'wrong',
      }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('missing salt', async () => {
    delete process.env.STATIC_SALT
    prisma.user.findFirst.mockResolvedValue(dbUser)

    await expect(
      service.loginUser({
        email: 'test@test.com',
        password: '123',
      }),
    ).rejects.toThrow('STATIC_SALT is not defined')
  })
})