import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { CartItemModel, CartModel } from './dto/cart.model'
import { itemDTO } from './dto/cart.dto'

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

  async addItem({ id, productId, qty }: itemDTO): Promise<CartItemModel> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    const cart = await this.getCart(id)

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
}
