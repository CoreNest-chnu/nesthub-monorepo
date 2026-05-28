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
  @ApiProperty({ type: String, required: false })
  status?: OrderStatus
}

export class UpdateOrderStatusDto {
  @ApiProperty({ type: String, required: true })
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
