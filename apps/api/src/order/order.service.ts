import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { OrderStatus } from 'generated/prisma/enums'
import { PrismaService } from 'prisma/lib/prisma'
import { OrderModel } from './dto/order.model'
import { UserId } from 'generated/prisma/types'
import { ShippingAddressDto } from './dto/order.dto'
import { toShippingAddressDto } from './util/order.util'

export type CreateOrder = {
  id: UserId
} & ShippingAddressDto

export type GetOrder = {
  userId: UserId
  orderId: string
}

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
      const cartItems = await tx.cartItem.findMany({
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

      await Promise.all(
        cartItems.map((item) =>
          tx.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          }),
        ),
      )

      await tx.cartItem.deleteMany({
        where: {
          Cart: {
            userId: id,
          },
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

  async findById({ userId, orderId }: GetOrder): Promise<OrderModel> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        Items: true,
      },
    })

    if (!order) {
      throw new NotFoundException('There is no order with such id')
    }

    if (order.userId !== userId) {
      throw new UnauthorizedException('You do not have access to this order')
    }

    return {
      ...order,

      shippingAddress: toShippingAddressDto(order.shippingAddress),

      totalAmount: Number(order.totalAmount),

      Items: order.Items.map((item) => ({
        ...item,
        priceAtPurchase: Number(item.priceAtPurchase),
      })),
    }
  }
}
