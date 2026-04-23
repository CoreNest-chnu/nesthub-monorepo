import { Controller, Get } from '@nestjs/common'
import { CategoriesService } from './category.service'
import { categoriesResponseDTO } from './dto/categories.model'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<categoriesResponseDTO[]> {
    return await this.categoriesService.findAll()
  }
}
