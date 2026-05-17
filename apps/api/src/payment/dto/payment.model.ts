import { ApiProperty } from '@nestjs/swagger'
import { CardBrand, PaymentStatus } from 'generated/prisma/enums'
import { PaymentId, SavedCardId } from 'generated/prisma/types'

export class SavedCardModel {
  @ApiProperty({ type: String })
  id!: SavedCardId
  last4!: string
  @ApiProperty({ enum: CardBrand })
  brand!: CardBrand
  expiryMonth!: number
  expiryYear!: number
  cardholderName!: string
  createdAt!: Date
}

export class PaymentModel {
  @ApiProperty({ type: String })
  id!: PaymentId
  orderId!: string
  last4!: string
  @ApiProperty({ enum: CardBrand })
  brand!: CardBrand
  expiryMonth!: number
  expiryYear!: number
  cardholderName!: string
  @ApiProperty({ enum: PaymentStatus })
  status!: PaymentStatus
  savedCardId!: string | null
  createdAt!: Date
}
