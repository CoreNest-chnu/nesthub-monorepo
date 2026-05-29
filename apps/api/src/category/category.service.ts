import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { CategoryModel } from './dto/category.model'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryModel[]> {
    return await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: { Products: true },
        },
      },
    })
  }
}
