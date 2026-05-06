import { Controller, Get } from '@nestjs/common'
import { CategoriesService } from './category.service'
import { CategoryModel } from './dto/category.model'
import { ApiResponse } from '@nestjs/swagger'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiResponse({ status: 200, type: CategoryModel, isArray: true })
  async findAll(): Promise<CategoryModel[]> {
    return await this.categoriesService.findAll()
  }
}
