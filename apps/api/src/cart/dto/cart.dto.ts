import { ApiProperty } from '@nestjs/swagger'
import type { ProductId } from 'generated/prisma/types'

export class CartItemDto {
  @ApiProperty({ type: String })
  productId!: ProductId

  qty!: number
}

export class UpdateCartItemDto {
  qty!: number
}
