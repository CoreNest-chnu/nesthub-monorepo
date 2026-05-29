import { AdminService } from './admin.service'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/role'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { ProductModel } from 'src/product/dto/product.model'
import {
  AdminOrderModel,
  UpdateOrderStatusDto,
  CreateProductDto,
  FindOrdersQueryDto,
  UpdateProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/admin.dto'
import { ApiResponse } from '@nestjs/swagger'
import {
  Category,
  CategoryId,
  OrderId,
  ProductId,
} from 'generated/prisma/types'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CategoryModel } from 'src/category/dto/category.model'

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('products')
  @ApiResponse({ status: 201, type: ProductModel })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductModel> {
    return await this.adminService.createProduct({ ...createProductDto })
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('orders')
  @ApiResponse({ status: 200, type: AdminOrderModel, isArray: true })
  findAllOrders(
    @Query() query: FindOrdersQueryDto,
  ): Promise<AdminOrderModel[]> {
    return this.adminService.findAllForAdmin(query)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('orders/:id')
  @ApiResponse({ status: 200, type: AdminOrderModel })
  updateOrderStatus(
    @Param('id') id: OrderId,
    @Body() { status }: UpdateOrderStatusDto,
  ): Promise<AdminOrderModel> {
    return this.adminService.updateOrderStatus({
      id,
      status,
    })
  }
  @Patch('products/:id')
  @ApiResponse({ status: 200, type: ProductModel })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: ProductId,
  ): Promise<ProductModel> {
    return this.adminService.updateProduct({ id, data: updateProductDto })
  }

  @Post('categories')
  @ApiResponse({ status: 201, type: CategoryModel })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryModel> {
    return this.adminService.createCategory(createCategoryDto)
  }

  @Patch('categories/:id')
  @ApiResponse({ status: 200, type: ProductModel })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCategory(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id') id: CategoryId,
  ): Promise<Category> {
    return this.adminService.updateCategory({
      id,
      data: updateCategoryDto,
    })
  }

  @Delete('categories/:id')
  @ApiResponse({
    status: 204,
    description: 'Successfully deleted category',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteCategory(@Param('id') id: CategoryId): Promise<void> {
    return this.adminService.deleteCategory(id)
  }
}
