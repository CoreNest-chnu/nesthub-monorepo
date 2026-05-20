import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AdminService } from './admin.service'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from 'src/common/decorators/role'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { ProductModel } from 'src/product/dto/product.model'
import { CreateProductDto } from './dto/admin.dto'

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
}
