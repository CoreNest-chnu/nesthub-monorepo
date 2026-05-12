import { ConflictException, Injectable } from '@nestjs/common'
import { OrderStatus } from 'generated/prisma/enums'
import { PrismaService } from 'prisma/lib/prisma'
import { OrderModel } from './dto/order.model'
import { UserId } from 'generated/prisma/types'
import { ShippingAddressDto } from './dto/order.dto'

export type CreateOrder = {
  id: UserId
} & ShippingAddressDto

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder({
    id,
    city,
    street,
    building,
    zip,
  }: CreateOrder): Promise<OrderModel> {
    return await this.prisma.$transaction(async (tx) => {
      const shippingAddress = {
        city,
        street,
        building,
        zip,
      }
      const cartItems = await this.prisma.cartItem.findMany({
        where: {
          Cart: {
            userId: id,
          },
        },
        include: {
          Product: true,
        },
      })
      for (const item of cartItems) {
        if (item.Product.stock < item.quantity) {
          throw new ConflictException(
            `Not enough stock for ${item.Product.name}`,
          )
        }
      }

      const totalAmount = cartItems.reduce((sum, Item) => {
        return sum + Number(Item.Product.price) * Item.quantity
      }, 0)

      const createdOrder = await tx.order.create({
        data: {
          userId: id,
          status: OrderStatus.pending,
          shippingAddress,
          totalAmount,
          Items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.Product.name,
              priceAtPurchase: item.Product.price,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          Items: true,
        },
      })

      return {
        ...createdOrder,
        shippingAddress,
        totalAmount: Number(createdOrder.totalAmount),
        Items: createdOrder.Items.map((item) => ({
          ...item,
          priceAtPurchase: Number(item.priceAtPurchase),
        })),
      }
    })
  }
}
