import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { PaginationQueryDto } from './dto/product.dto'
import { Decimal } from '@prisma/client/runtime/index-browser'
import { PaginatedResponseDto, ProductModel } from './dto/product.model'
import { Prisma } from 'generated/prisma/browser'
import { ProductId } from 'generated/prisma/types'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts({
    page = 1,
    take = 20,
    categoryId,
    search,
    rating,
    stock,
    priceTo,
    priceFrom = 0,
  }: PaginationQueryDto): Promise<PaginatedResponseDto> {
    const AND: Prisma.ProductWhereInput[] = []

    if (categoryId) {
      AND.push({ categoryId })
    }

    if (search) {
      AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      })
    }

    if (rating) {
      AND.push({ rating })
    }

    if (stock !== undefined) {
      AND.push({ stock: stock ? { gt: 0 } : { equals: 0 } })
    }

    if (priceTo !== undefined) {
      AND.push({
        price: {
          ...(priceFrom && { gte: priceFrom }),
          lte: priceTo,
        },
      })
    }

    const total = await this.prisma.product.count({ where: { AND } })

    const totalPages = Decimal(total).div(take).ceil().toNumber()
    const safePage = Math.min(page, totalPages) || 1

    const products = await this.prisma.product.findMany({
      where: { AND },
      take,
      skip: Decimal(take).mul(Decimal(safePage).sub(1)).toNumber(),
      include: {
        category: true,
      },
    })

    return {
      products,
      total,
      page: safePage,
      take,
      totalPages,
    }
  }

  async findById(id: ProductId): Promise<ProductModel> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product
  }
}
