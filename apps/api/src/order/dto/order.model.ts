import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from 'generated/prisma/browser'
import { ShippingAddressDto } from './order.dto'

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
  @ApiProperty({ type: ShippingAddressDto })
  shippingAddress!: ShippingAddressDto
  totalAmount!: number
  @ApiProperty({ type: () => [OrderItemModel] })
  Items!: OrderItemModel[]
  createdAt!: Date
  updatedAt!: Date
}
