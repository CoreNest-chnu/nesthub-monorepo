import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { OrderService } from './order.service'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CurrentUser } from 'src/user/user.util'
import { User } from 'generated/prisma/browser'
import { OrderModel } from './dto/order.model'
import { ShippingAddressDto } from './dto/order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser() { id }: User,
    @Body() shippingAddressDto: ShippingAddressDto,
  ): Promise<OrderModel> {
    return await this.orderService.create({ userId: id, ...shippingAddressDto })
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(
    @CurrentUser() { id }: User,
    @Param('id') orderId: string,
  ): Promise<OrderModel> {
    return await this.orderService.findById({ userId: id, orderId })
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async allOrders(@CurrentUser() { id }: User): Promise<OrderModel[]> {
    return await this.orderService.findAllByUser(id)
  }
}
