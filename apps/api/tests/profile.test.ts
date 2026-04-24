import { describe, it, expect, beforeEach, jest } from 'bun:test'
import { UserService } from '../src/user/user.service'
import { NotFoundException } from '@nestjs/common'

describe('UserService - profile', () => {
  let service: UserService

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  }

  beforeEach(() => {
    service = new UserService(prismaMock as any)
    jest.clearAllMocks()
  })

  // 🟢Успішно зробити профіль
  it('should return user profile successfully', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'hashed-password',
    })

    const result = await service.getMyProfile(1 as any)

    expect(result).toBeDefined()
    expect(result.email).toBe('test@test.com')
    expect(result.id).toBe(1)
  })

  // 🔴 Профіль не знайдено
  it('should throw NotFoundException if user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    await expect(service.getMyProfile(999 as any)).rejects.toThrow(
      NotFoundException,
    )
  })

  // 🟢 Оновлення профілю
  it('should update profile successfully', async () => {
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      email: 'test@test.com',
      firstName: 'Updated',
      lastName: 'User',
    })

    const result = await service.updateProfile({
      id: 1 as any,
      data: {
        firstName: 'Updated',
      } as any,
    })

    expect(result.firstName).toBe('Updated')
    expect(result.email).toBe('test@test.com')
  })

  // 🟡 optional email update
  it('should allow email update (no restriction in service)', async () => {
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      email: 'new@mail.com',
      firstName: 'John',
    })

    const result = await service.updateProfile({
      id: 1 as any,
      data: {
        email: 'new@mail.com',
      } as any,
    })

    expect(result.email).toBe('new@mail.com')
  })
})