import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { ProductModel } from 'src/product/dto/product.model'
import { CreateProductDto } from './dto/admin.dto'

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
}
