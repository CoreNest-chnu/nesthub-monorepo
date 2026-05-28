import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
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
} from './dto/admin.dto'
import { ApiResponse } from '@nestjs/swagger'
import { OrderId } from 'generated/prisma/types'

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
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<AdminOrderModel> {
    return this.adminService.updateOrderStatus({
      id,
      status: dto.status,
    })
  }
}
