import { ApiProperty } from '@nestjs/swagger'
import { CartId, CartItemId } from 'generated/prisma/types'
import { ProductModel } from '../../product/dto/product.model'

export class CartModel {
  @ApiProperty({ type: String })
  id!: CartId
  userId!: string
  @ApiProperty({ type: () => CartItemModel, isArray: true })
  Items!: CartItemModel[]
  createdAt!: Date
  updatedAt!: Date
}

export class CartItemModel {
  @ApiProperty({ type: String })
  id!: CartItemId
  productId!: string
  quantity!: number
  @ApiProperty({ type: () => ProductModel })
  Product!: ProductModel
  createdAt!: Date
  updatedAt!: Date
}
