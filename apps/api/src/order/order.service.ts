import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { OrderModel } from './dto/order.model'
import { UserId } from 'generated/prisma/types'
import { FindAllOrderDto, ShippingAddressDto } from './dto/order.dto'
import { toShippingAddressDto } from './util/order.util'
import { Decimal } from '@prisma/client/runtime/client'
import { Prisma } from 'generated/prisma/client'

export type CreateOrder = {
  userId: UserId
} & ShippingAddressDto

export type GetOrder = {
  userId: UserId
  orderId: string
}

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    userId,
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
            userId,
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

      const totalAmount = cartItems.reduce(
        (sum, { Product, quantity }) => sum.add(Product.price.mul(quantity)),
        new Prisma.Decimal(0),
      )

      const createdOrder = await tx.order.create({
        data: {
          userId,
          status: 'pending',
          shippingAddress,
          totalAmount,
          Items: {
            create: cartItems.map(({ productId, Product, quantity }) => ({
              productId,
              productName: Product.name,
              priceAtPurchase: Product.price,
              quantity,
            })),
          },
        },
        include: {
          Items: true,
        },
      })

      await Promise.all(
        cartItems.map(({ productId, quantity }) =>
          tx.product.update({
            where: {
              id: productId,
            },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          }),
        ),
      )

      await tx.cartItem.deleteMany({
        where: {
          Cart: {
            userId,
          },
        },
      })

      return {
        ...createdOrder,
        shippingAddress,
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
      Items: order.Items.map((item) => ({
        ...item,
        priceAtPurchase: Decimal(item.priceAtPurchase),
      })),
    }
  }

  async findAllByUser({ userId }: FindAllOrderDto): Promise<OrderModel[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        Items: true,
      },
    })

    return orders.map((order) => ({
      ...order,
      shippingAddress: toShippingAddressDto(order.shippingAddress),
    }))
  }
}
