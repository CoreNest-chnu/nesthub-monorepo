import { Controller, Get } from '@nestjs/common'
import { CategoriesService } from './category.service'
import { CategoryModel } from './dto/category.model'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<CategoryModel[]> {
    return await this.categoriesService.findAll()
  }
}
