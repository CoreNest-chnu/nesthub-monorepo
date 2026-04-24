import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { PaginationQueryDto } from './dto/product.dto'
import { Decimal } from '@prisma/client/runtime/index-browser'
import { PaginatedResponseDto } from './dto/product.model'
import { Prisma } from 'generated/prisma/browser'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts({
    page = 1,
    take = 20,
    categoryId,
    search,
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

    const products = await this.prisma.product.findMany({
      where: { AND },
      take,
      skip: Decimal(take).mul(Decimal(page).sub(1)).toNumber(),
      include: {
        category: true,
      },
    })

    const total = await this.prisma.product.count({ where: { AND } })

    const totalPages = Decimal(total).div(take).ceil().toNumber()

    return {
      products,
      total,
      page,
      take,
      totalPages,
    }
  }
}
