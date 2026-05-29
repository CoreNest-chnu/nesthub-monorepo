import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { ProductModel } from 'src/product/dto/product.model'
import {
  AdminOrderModel,
  CreateCategoryDto,
  CreateProductDto,
  FindOrdersQueryDto,
  UpdateCategoryDto,
  UpdateProductDto,
} from './dto/admin.dto'
import { toShippingAddressDto } from 'src/order/util/order.util'
import { OrderStatus } from 'generated/prisma/enums'
import { CategoryId, OrderId, ProductId } from 'generated/prisma/types'
import { CategoryModel } from 'src/category/dto/category.model'

type UpdateOrderArgs = {
  id: OrderId
  status: OrderStatus
}

type UpdateCategoryArgs = {
  id: CategoryId
  data: UpdateCategoryDto
}

type UpdateProductArgs = {
  id: ProductId
  data: UpdateProductDto
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
    status,
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

  async updateCategory({
    data,
    id,
  }: UpdateCategoryArgs): Promise<CategoryModel> {
    return await this.prisma.category.update({
      where: { id },
      data,
    })
  }

  async createCategory(data: CreateCategoryDto): Promise<CategoryModel> {
    return await this.prisma.category.create({
      data,
    })
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            Products: true,
          },
        },
      },
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    if (category._count.Products > 0) {
      throw new ConflictException(
        'Category cannot be deleted because it has products',
      )
    }

    await this.prisma.category.delete({
      where: { id },
    })
  }

  async updateProduct({ id, data }: UpdateProductArgs): Promise<ProductModel> {
    return await this.prisma.product.update({
      where: { id },
      data,
      include: {
        Category: true,
      },
    })
  }
}
