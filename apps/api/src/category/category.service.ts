import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { categoriesResponseDTO } from './dto/categories.model'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<categoriesResponseDTO[]> {
    return await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  }
}
