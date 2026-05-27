import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { ProductModel } from 'src/product/dto/product.model'
import {
  CreateCategoryDto,
  CreateProductDto,
  UpdateCategoryDto,
} from './dto/admin.dto'
import { CategoryModel } from 'generated/prisma/models'
import { CategoryId } from 'generated/prisma/types'

type UpdateCategoryArgs = {
  id: CategoryId
  data: UpdateCategoryDto
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

  async createCategory({ name }: CreateCategoryDto): Promise<CategoryModel> {
    return await this.prisma.category.create({
      data: {
        name,
      },
    })
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
}
