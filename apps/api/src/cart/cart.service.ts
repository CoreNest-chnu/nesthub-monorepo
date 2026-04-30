import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { CartItemModel, CartModel } from './dto/cart.model'
import { UserId } from 'generated/prisma/types'
import { CartItemDto, UpdateCartItemDto } from './dto/cart.dto'

export type AddCartItem = {
  id: UserId
} & CartItemDto

type UpdateCartItems = {
  id: UserId
  cartItemId: string
} & UpdateCartItemDto

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string): Promise<CartModel> {
    const cart = await this.prisma.cart.findUniqueOrThrow({
      where: { userId },
      include: {
        Items: true,
      },
    })

    return cart
  }

  async addItem({ id, productId, qty }: AddCartItem): Promise<CartItemModel> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId: id },
      select: { id: true },
    })

    if (!cart) {
      throw new NotFoundException()
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      select: { quantity: true },
    })

    const currentQty = cartItem?.quantity ?? 0

    if (currentQty + qty > product.stock) {
      throw new BadRequestException()
    }

    return await this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: { increment: qty },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity: qty,
      },
    })
  }

  async updateItem({
    id,
    cartItemId,
    qty,
  }: UpdateCartItems): Promise<CartItemModel> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { Product: true, Cart: true },
    })

    if (!cartItem) {
      throw new NotFoundException()
    }

    if (cartItem.Cart.userId !== id) {
      throw new ForbiddenException()
    }

    if (cartItem.Product.stock < qty) {
      throw new BadRequestException()
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: qty },
    })
  }
}
