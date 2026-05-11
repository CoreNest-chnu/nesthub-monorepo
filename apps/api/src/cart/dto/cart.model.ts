import { ApiProperty } from '@nestjs/swagger'
import { CartId, CartItemId } from 'generated/prisma/types'

export class CartModel {
  @ApiProperty({ type: String })
  id!: CartId
  userId!: string
  @ApiProperty({ type: () => CartItemModel })
  Items!: CartItemModel[]
  createdAt!: Date
  updatedAt!: Date
}

export class CartItemModel {
  @ApiProperty({ type: String })
  id!: CartItemId
  productId!: string
  quantity!: number
  createdAt!: Date
  updatedAt!: Date
}

export class CartItemWithStockModel extends CartItemModel {
  isOverStock!: boolean
}

export class CartWithStockModel extends CartModel {
  @ApiProperty({ type: () => [CartItemWithStockModel] })
  declare Items: CartItemWithStockModel[]
}
