import { Controller } from '@nestjs/common'
import { CategoryService } from './category.service'

@Controller('products')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
}
