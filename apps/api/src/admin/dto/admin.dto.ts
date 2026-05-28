import { ApiProperty } from '@nestjs/swagger'
import { IsPositive, IsUrl, Min } from 'class-validator'
import { OrderStatus } from 'generated/prisma/enums'
import { OrderModel } from 'src/order/dto/order.model'

export class CreateProductDto {
  name!: string
  description?: string
  categoryId!: string

  @IsPositive()
  price!: number

  @Min(0)
  stock!: number

  @IsUrl()
  imageUrl?: string
}

export class FindOrdersQueryDto {
  status?: OrderStatus
}

export class UpdateOrderStatusDto {
  status: OrderStatus
}

export class AdminOrderUserModel {
  firstName: string
  lastName: string
  email: string
}

export class AdminOrderModel extends OrderModel {
  @ApiProperty({ type: AdminOrderUserModel })
  User: AdminOrderUserModel
}
