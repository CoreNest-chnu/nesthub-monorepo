import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { OrderService } from './order.service'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CurrentUser } from 'src/user/user.util'
import { User } from 'generated/prisma/browser'
import { OrderModel } from './dto/order.model'
import { CreateOrderDto } from './dto/order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser() { id }: User,
    @Body()
    { shippingAddress: { city, street, building, zip } }: CreateOrderDto,
  ): Promise<OrderModel> {
    return await this.orderService.createOrder(id, {
      city,
      street,
      building,
      zip,
    })
  }
}
