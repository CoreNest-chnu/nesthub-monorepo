import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { NotFoundException } from '@nestjs/common'
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

let prisma: any
let service: UserService

beforeEach(() => {
  prisma = {
    user: {
      findUnique: mock(),
      update: mock(),
    },
  }

  service = new UserService(prisma)
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