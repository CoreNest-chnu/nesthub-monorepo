import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { ProductModel } from 'src/product/dto/product.model'
import { CreateProductDto, UpdateProductDto } from './dto/admin.dto'
import { ProductId } from 'generated/prisma/types'

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
