import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from 'generated/prisma/browser'
import { ShippingAddressDto } from './order.dto'
import type { OrderId, OrderItemId } from 'generated/prisma/types'
import { Prisma } from 'generated/prisma/client'

export class OrderItemModel {
  @ApiProperty({ type: String })
  id!: OrderItemId
  orderId!: string
  productId!: string
  productName!: string
  @ApiProperty({ type: String })
  priceAtPurchase!: Prisma.Decimal
  quantity!: number
  createdAt!: Date
  updatedAt!: Date
}

export class OrderModel {
  @ApiProperty({ type: String })
  id!: OrderId
  userId!: string
  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus
  @ApiProperty({ type: ShippingAddressDto })
  shippingAddress!: ShippingAddressDto
  @ApiProperty({ type: String })
  totalAmount!: Prisma.Decimal
  @ApiProperty({ type: () => OrderItemModel, isArray: true })
  Items!: OrderItemModel[]
  createdAt!: Date
  updatedAt!: Date
}
