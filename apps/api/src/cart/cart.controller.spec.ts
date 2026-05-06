import { describe, it, expect, beforeEach, mock } from 'bun:test'
import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'

mock.module('@nestjs/swagger', () => ({
  ApiResponse: () => () => {},
  ApiProperty: () => () => {},
}))

mock.module('@nestjs/common', () => ({
  Controller: () => () => {},
  Get: () => () => {},
  Post: () => () => {},
  Patch: () => () => {},
  Delete: () => () => {},
  Body: () => () => {},
  Param: () => () => {},
  UseGuards: () => () => {},
  Injectable: () => () => {},
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
}))

mock.module('src/auth/auth.guard', () => ({
  JwtAuthGuard: class {},
}))

mock.module('src/user/user.util', () => ({
  CurrentUser: () => () => {},
}))

const { CartController } = require('./cart.controller')

describe('CartController', () => {
  let cartService: {
    getCart: ReturnType<typeof mock>
    addItem: ReturnType<typeof mock>
    updateItem: ReturnType<typeof mock>
  }

  let controller: {
    getCart: (id: string) => Promise<unknown>
    addItem: (user: { id: string }, dto: { productId: string; qty: number }) => Promise<unknown>
    updateItem: (user: { id: string }, cartItemId: string, dto: { qty: number }) => Promise<unknown>
  }

  beforeEach(() => {
    cartService = {
      getCart: mock(),
      addItem: mock(),
      updateItem: mock(),
    }

    controller = new CartController(cartService)
  })

  it('getCart — повертає кошик по userId', async () => {
    const cart = { id: 'cart-1', userId: 'user-1', Items: [] }
    cartService.getCart.mockResolvedValue(cart)

    const result = await controller.getCart('user-1')

    expect(cartService.getCart).toHaveBeenCalledWith('user-1')
    expect(result).toEqual(cart)
  })

  it('getCart — якщо кошик не знайдено кидає NotFoundException', async () => {
    cartService.getCart.mockRejectedValue(new NotFoundException())

    await expect(controller.getCart('user-1')).rejects.toThrow(NotFoundException)
  })

  it('addItem — авторизований користувач додає товар', async () => {
    const cartItem = { id: 'item-1', productId: 'prod-1', quantity: 1 }
    cartService.addItem.mockResolvedValue(cartItem)

    const result = await controller.addItem(
      { id: 'user-1' },
      { productId: 'prod-1', qty: 1 },
    )

    expect(cartService.addItem).toHaveBeenCalledWith({
      id: 'user-1',
      productId: 'prod-1',
      qty: 1,
    })
    expect(result).toEqual(cartItem)
  })

  it('addItem — неавторизований кидає UnauthorizedException', async () => {
    cartService.addItem.mockRejectedValue(new UnauthorizedException())

    await expect(
      controller.addItem({ id: '' }, { productId: 'prod-1', qty: 1 }),
    ).rejects.toThrow(UnauthorizedException)
  })

  it('addItem — stock=0 кидає BadRequestException', async () => {
    cartService.addItem.mockRejectedValue(
      new BadRequestException("We don't have such amount in stock"),
    )

    await expect(
      controller.addItem({ id: 'user-1' }, { productId: 'prod-1', qty: 1 }),
    ).rejects.toThrow(BadRequestException)
  })

  it('addItem — продукт не знайдено кидає NotFoundException', async () => {
    cartService.addItem.mockRejectedValue(new NotFoundException('Product not found'))

    await expect(
      controller.addItem({ id: 'user-1' }, { productId: 'prod-999', qty: 1 }),
    ).rejects.toThrow(NotFoundException)
  })

  it('updateItem — авторизований користувач оновлює qty', async () => {
    const updated = { id: 'item-1', quantity: 5 }
    cartService.updateItem.mockResolvedValue(updated)

    const result = await controller.updateItem(
      { id: 'user-1' },
      'item-1',
      { qty: 5 },
    )

    expect(cartService.updateItem).toHaveBeenCalledWith({
      id: 'user-1',
      cartItemId: 'item-1',
      qty: 5,
    })
    expect(result).toEqual(updated)
  })

  it('updateItem — чужий cartItem кидає ForbiddenException', async () => {
    cartService.updateItem.mockRejectedValue(
      new ForbiddenException('You do not have access to this cart item'),
    )

    await expect(
      controller.updateItem({ id: 'user-1' }, 'item-1', { qty: 3 }),
    ).rejects.toThrow(ForbiddenException)
  })

  it('updateItem — cartItem не знайдено кидає NotFoundException', async () => {
    cartService.updateItem.mockRejectedValue(
      new NotFoundException('There is no such item in your cart'),
    )

    await expect(
      controller.updateItem({ id: 'user-1' }, 'item-999', { qty: 1 }),
    ).rejects.toThrow(NotFoundException)
  })

  it('updateItem — qty перевищує stock кидає BadRequestException', async () => {
    cartService.updateItem.mockRejectedValue(
      new BadRequestException("We don't have such amount in stock"),
    )

    await expect(
      controller.updateItem({ id: 'user-1' }, 'item-1', { qty: 999 }),
    ).rejects.toThrow(BadRequestException)
  })
})