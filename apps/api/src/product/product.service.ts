import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import {
  PaginationQueryDto,
  PaginatedResponseDto,
  ProductResponseDto,
} from './dto/product.dto'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts({
    page,
    limit,
  }: PaginationQueryDto): Promise<PaginatedResponseDto<ProductResponseDto>> {
    const skip = (page - 1) * limit
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      this.prisma.product.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    }
  }
}
