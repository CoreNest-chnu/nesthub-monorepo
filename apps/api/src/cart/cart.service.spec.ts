import { describe, it, expect, beforeEach, mock } from 'bun:test'
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'

describe('CartService', () => {
  let prisma: {
    cart: {
      findUniqueOrThrow: ReturnType<typeof mock>
      findUnique: ReturnType<typeof mock>
    }
    product: {
      findUnique: ReturnType<typeof mock>
    }
    cartItem: {
      findUnique: ReturnType<typeof mock>
      upsert: ReturnType<typeof mock>
      update: ReturnType<typeof mock>
    }
  }

  let service: {
    getCart: (userId: string) => Promise<unknown>
    addItem: (data: { id: string; productId: string; qty: number }) => Promise<unknown>
    updateItem: (data: { id: string; cartItemId: string; qty: number }) => Promise<unknown>
  }

  beforeEach(() => {
    prisma = {
      cart: {
        findUniqueOrThrow: mock(),
        findUnique: mock(),
      },
      product: {
        findUnique: mock(),
      },
      cartItem: {
        findUnique: mock(),
        upsert: mock(),
        update: mock(),
      },
    }

    const { CartService } = require('./cart.service')
    service = new CartService(prisma)
  })

  // ─── getCart ───────────────────────────────────────────────

  it('getCart — повертає кошик користувача', async () => {
    const cart = { id: 'cart-1', userId: 'user-1', Items: [] }
    prisma.cart.findUniqueOrThrow.mockResolvedValue(cart)

    const result = await service.getCart('user-1')

    expect(prisma.cart.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      include: { Items: true },
    })
    expect(result).toEqual(cart)
  })

  // ─── addItem ───────────────────────────────────────────────

  it('addItem — новий товар створює CartItem з qty=1', async () => {
    prisma.product.findUnique.mockResolvedValue({ stock: 10 })
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' })
    prisma.cartItem.findUnique.mockResolvedValue(null)
    prisma.cartItem.upsert.mockResolvedValue({ id: 'item-1', productId: 'prod-1', quantity: 1 })

    const result = await service.addItem({ id: 'user-1', productId: 'prod-1', qty: 1 }) as { quantity: number }

    expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 'prod-1' } },
      update: { quantity: { increment: 1 } },
      create: { cartId: 'cart-1', productId: 'prod-1', quantity: 1 },
    })
    expect(result.quantity).toBe(1)
  })

  it('addItem — повторне додавання збільшує qty', async () => {
    prisma.product.findUnique.mockResolvedValue({ stock: 10 })
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' })
    prisma.cartItem.findUnique.mockResolvedValue({ quantity: 2 })
    prisma.cartItem.upsert.mockResolvedValue({ id: 'item-1', productId: 'prod-1', quantity: 3 })

    const result = await service.addItem({ id: 'user-1', productId: 'prod-1', qty: 1 }) as { quantity: number }

    expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
      where: { cartId_productId: { cartId: 'cart-1', productId: 'prod-1' } },
      update: { quantity: { increment: 1 } },
      create: { cartId: 'cart-1', productId: 'prod-1', quantity: 1 },
    })
    expect(result.quantity).toBe(3)
  })

  it('addItem — stock=0 кидає BadRequestException', async () => {
    prisma.product.findUnique.mockResolvedValue({ stock: 0 })
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' })
    prisma.cartItem.findUnique.mockResolvedValue(null)

    await expect(
      service.addItem({ id: 'user-1', productId: 'prod-1', qty: 1 }),
    ).rejects.toThrow(BadRequestException)
  })

  it('addItem — qty перевищує stock кидає BadRequestException', async () => {
    prisma.product.findUnique.mockResolvedValue({ stock: 3 })
    prisma.cart.findUnique.mockResolvedValue({ id: 'cart-1' })
    prisma.cartItem.findUnique.mockResolvedValue({ quantity: 2 })

    await expect(
      service.addItem({ id: 'user-1', productId: 'prod-1', qty: 2 }),
    ).rejects.toThrow(BadRequestException)
  })

  it('addItem — продукт не знайдено кидає NotFoundException', async () => {
    prisma.product.findUnique.mockResolvedValue(null)

    await expect(
      service.addItem({ id: 'user-1', productId: 'prod-1', qty: 1 }),
    ).rejects.toThrow(NotFoundException)
  })

  it('addItem — кошик не знайдено кидає NotFoundException', async () => {
    prisma.product.findUnique.mockResolvedValue({ stock: 10 })
    prisma.cart.findUnique.mockResolvedValue(null)

    await expect(
      service.addItem({ id: 'user-1', productId: 'prod-1', qty: 1 }),
    ).rejects.toThrow(NotFoundException)
  })

  // ─── updateItem ────────────────────────────────────────────

  it('updateItem — оновлює кількість товару', async () => {
    prisma.cartItem.findUnique.mockResolvedValue({
      id: 'item-1',
      Cart: { userId: 'user-1' },
      Product: { stock: 10 },
    })
    prisma.cartItem.update.mockResolvedValue({ id: 'item-1', quantity: 5 })

    const result = await service.updateItem({ id: 'user-1', cartItemId: 'item-1', qty: 5 }) as { quantity: number }

    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: { id: 'item-1' },
      data: { quantity: 5 },
    })
    expect(result.quantity).toBe(5)
  })

  it('updateItem — чужий cartItem кидає ForbiddenException', async () => {
    prisma.cartItem.findUnique.mockResolvedValue({
      id: 'item-1',
      Cart: { userId: 'other-user' },
      Product: { stock: 10 },
    })

    await expect(
      service.updateItem({ id: 'user-1', cartItemId: 'item-1', qty: 1 }),
    ).rejects.toThrow(ForbiddenException)
  })

  it('updateItem — qty перевищує stock кидає BadRequestException', async () => {
    prisma.cartItem.findUnique.mockResolvedValue({
      id: 'item-1',
      Cart: { userId: 'user-1' },
      Product: { stock: 2 },
    })

    await expect(
      service.updateItem({ id: 'user-1', cartItemId: 'item-1', qty: 5 }),
    ).rejects.toThrow(BadRequestException)
  })

  it('updateItem — cartItem не знайдено кидає NotFoundException', async () => {
    prisma.cartItem.findUnique.mockResolvedValue(null)

    await expect(
      service.updateItem({ id: 'user-1', cartItemId: 'item-1', qty: 1 }),
    ).rejects.toThrow(NotFoundException)
  })
})