import { ApiProperty } from '@nestjs/swagger'
import { OrderStatus } from 'generated/prisma/browser'
import { ShippingAddressDto } from './order.dto'
import { OrderId, OrderItemId } from 'generated/prisma/types'
import { Prisma } from 'generated/prisma/client'

export class OrderItemModel {
  id!: OrderItemId
  orderId!: string
  productId!: string
  productName!: string
  priceAtPurchase!: Prisma.Decimal
  quantity!: number
  createdAt!: Date
  updatedAt!: Date
}

export class OrderModel {
  id!: OrderId
  userId!: string
  @ApiProperty({ enum: OrderStatus })
  status!: OrderStatus
  @ApiProperty({ type: ShippingAddressDto })
  shippingAddress!: ShippingAddressDto
  totalAmount!: Prisma.Decimal
  @ApiProperty({ type: () => [OrderItemModel] })
  Items!: OrderItemModel[]
  createdAt!: Date
  updatedAt!: Date
}
