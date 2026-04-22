import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from './dto/product.dto'
import { Decimal } from '@prisma/client/runtime/index-browser'

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts({
    page = 1,
    take = 20,
  }: PaginationQueryDto): Promise<PaginatedResponseDto> {

    const skip = new Decimal(take).mul(new Decimal(page).sub(1)).toNumber()
    
    const [items] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take,
        include: {
          category: true,
        },
      }),
    ])
       
    const total = await this.prisma.product.count()

    const totalPages = Math.ceil(total / take)

    return {
      items,
      total,
      page,
      take,
      totalPages,
    }
  }
}
