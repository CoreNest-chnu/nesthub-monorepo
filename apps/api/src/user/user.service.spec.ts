import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { NotFoundException } from '@nestjs/common'

type User = {
  id: string
  firstName?: string
}

describe('UserService', () => {
  let prisma: {
    user: {
      findUnique: ReturnType<typeof mock>
      update: ReturnType<typeof mock>
    }
  }

  let service: {
    getMyProfile: (id: string) => Promise<User>
    updateProfile: (args: {
      id: string
      data: Partial<User>
    }) => Promise<User>
  }

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: mock(),
        update: mock(),
      },
    }

    service = {
      getMyProfile: async (id: string) => {
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) throw new NotFoundException()
        return user
      },
      updateProfile: async ({ id, data }) => {
        return prisma.user.update({
          where: { id },
          data,
        })
      },
    }
  })

  it('get profile', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1' })
    const res = await service.getMyProfile('1')
    expect(res).toEqual({ id: '1' })
  })

  it('not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    await expect(service.getMyProfile('1')).rejects.toThrow(NotFoundException)
  })

  it('update', async () => {
    prisma.user.update.mockResolvedValue({
      id: '1',
      firstName: 'Jane',
    })
    const res = await service.updateProfile({
      id: '1',
      data: { firstName: 'Jane' },
    })
    expect(res.firstName).toBe('Jane')
  })
})