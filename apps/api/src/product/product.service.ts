import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { PaginationQueryDto } from './dto/product.dto'
import { PaginatedProductResponseDto } from './dto/product.model'
import { Decimal } from '@prisma/client/runtime/index-browser'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts({
    page = 1,
    take = 20,
  }: PaginationQueryDto): Promise<PaginatedProductResponseDto> {
    const products = await this.prisma.product.findMany({
      take,
      skip: Decimal(take).mul(Decimal(page).sub(1)).toNumber(),
      include: {
        category: true,
      },
    })

    const total = await this.prisma.product.count()

    const totalPages = Decimal(total).div(take).ceil().toNumber()

    return {
      products: products.map((p) => ({ ...p, price: p.price.toString() })),
      total,
      page,
      take,
      totalPages,
    }
  }
}
