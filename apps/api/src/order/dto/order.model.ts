import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from 'generated/prisma/browser'
import { ShippingAddressDto } from './order.dto'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'

export class OrderItemModel {
  id!: string
  orderId!: string
  productId!: string
  productName!: string
  priceAtPurchase!: number
  quantity!: number
  createdAt!: Date
  updatedAt!: Date
}

export class OrderModel {
  id!: string
  userId!: string
  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus
  totalAmount!: number
  @ApiProperty({ type: () => [OrderItemModel] })
  Items!: OrderItemModel[]
  createdAt!: Date
  updatedAt!: Date

  @Type(() => ShippingAddressDto)
  @ValidateNested()
  shippingAddress!: ShippingAddressDto
}
