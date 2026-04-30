import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { CartModel } from './dto/cart.model'

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
}
