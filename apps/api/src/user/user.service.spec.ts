import { NotFoundException } from '@nestjs/common'
import { mockDeep, type DeepMockProxy } from 'jest-mock-extended'
import { type PrismaClient, Role } from '../../generated/prisma/client'
import { UserService } from './user.service'

jest.mock('prisma/lib/prisma')

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
let service: UserService

beforeEach(() => {
  prisma = mockDeep<PrismaClient>()
  service = new UserService(prisma)
  jest.clearAllMocks()
})

describe('getMyProfile', () => {
  it('повертає профіль користувача', async () => {
    prisma.user.findUnique.mockResolvedValue(dbUser)

    await expect(service.getMyProfile('1')).resolves.toEqual(dbUser)
  })

  it('кидає NotFoundException якщо користувача не існує', async () => {
    prisma.user.findUnique.mockResolvedValue(null)

    await expect(service.getMyProfile('1')).rejects.toThrow(NotFoundException)
  })
})

describe('updateProfile', () => {
  it('оновлює та повертає профіль', async () => {
    const updated = { ...dbUser, firstName: 'Jane' }
    prisma.user.update.mockResolvedValue(updated)

    await expect(
      service.updateProfile({ id: '1', data: { firstName: 'Jane' } }),
    ).resolves.toEqual(updated)
  })
})
