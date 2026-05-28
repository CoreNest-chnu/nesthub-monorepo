import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { ProductModel } from 'src/product/dto/product.model'
import {
  AdminOrderModel,
  CreateProductDto,
  FindOrdersQueryDto,
} from './dto/admin.dto'
import { toShippingAddressDto } from 'src/order/util/order.util'
import { OrderStatus } from 'generated/prisma/enums'
import { OrderId } from 'generated/prisma/types'

type UpdateOrderArgs = {
  id: OrderId
  status: OrderStatus
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct({
    name,
    description,
    price,
    categoryId,
    stock,
    imageUrl,
  }: CreateProductDto): Promise<ProductModel> {
    return await this.prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl,
        categoryId,
      },
      include: {
        Category: true,
      },
    })
  }

  async findAllForAdmin({
    status = 'pending',
  }: FindOrdersQueryDto): Promise<AdminOrderModel[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        status,
      },
      include: {
        Items: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return orders.map((order) => ({
      ...order,
      shippingAddress: toShippingAddressDto(order.shippingAddress),
    }))
  }

  async updateOrderStatus({
    id,
    status,
  }: UpdateOrderArgs): Promise<AdminOrderModel> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        Items: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!order) {
      throw new NotFoundException('Order not found')
    }

    const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['paid'],
      paid: ['shipped'],
      shipped: ['completed'],
      completed: [],
      cancelled: [],
    }

    const isAllowed = allowedTransitions[order.status].includes(status)

    if (!isAllowed) {
      throw new BadRequestException(
        `Invalid order status transition: ${order.status} -> ${status}`,
      )
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        Items: true,
        User: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return {
      ...updatedOrder,
      shippingAddress: toShippingAddressDto(updatedOrder.shippingAddress),
    }
  }
}
