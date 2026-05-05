/// <reference types="jest" />
import { NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { Role } from '../../generated/prisma/client'
import { UserService } from './user.service'

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
    update: jest.Mock
  }
}

let prisma: PrismaMock
let service: UserService

beforeEach(() => {
  prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  service = new UserService(prisma as unknown as PrismaService)
})

describe('UserService', () => {
  describe('getMyProfile', () => {
    it('повертає профіль користувача', async () => {
      prisma.user.findUnique.mockResolvedValue(dbUser)

      await expect(service.getMyProfile('1')).resolves.toEqual(dbUser)
    })

    it('кидає NotFoundException якщо користувача немає', async () => {
      prisma.user.findUnique.mockResolvedValue(null)

      await expect(service.getMyProfile('1')).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('updateProfile', () => {
    it('оновлює та повертає профіль користувача', async () => {
      const updated = { ...dbUser, firstName: 'Jane' }

      prisma.user.update.mockResolvedValue(updated)

      await expect(
        service.updateProfile({
          id: '1',
          data: { firstName: 'Jane' },
        }),
      ).resolves.toEqual(updated)
    })
  })
})
