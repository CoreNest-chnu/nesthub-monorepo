import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/role'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { ProductModel } from 'src/product/dto/product.model'
import { CreateProductDto, UpdateProductDto } from './dto/admin.dto'
import { ProductId } from 'generated/prisma/types'
import { ApiResponse } from '@nestjs/swagger'

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
}
