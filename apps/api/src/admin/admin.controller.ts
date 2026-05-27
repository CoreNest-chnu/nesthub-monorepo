import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/role'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { ProductModel } from 'src/product/dto/product.model'
import {
  CreateCategoryDto,
  CreateProductDto,
  UpdateCategoryDto,
} from './dto/admin.dto'
import { CategoryModel } from 'generated/prisma/models'
import { Category } from 'generated/prisma/browser'
import { CategoryId } from 'generated/prisma/types'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductModel> {
    return await this.adminService.createProduct({ ...createProductDto })
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryModel> {
    return await this.adminService.createCategory(createCategoryDto)
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') id: CategoryId,
  ): Promise<Category> {
    return await this.adminService.updateCategory({
      id,
      data: updateCategoryDto,
    })
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteCategory(@Param('id') id: CategoryId): Promise<void> {
    return await this.adminService.deleteCategory(id)
  }
}
