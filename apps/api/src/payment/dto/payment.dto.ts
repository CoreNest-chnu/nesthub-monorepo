import { ApiProperty } from '@nestjs/swagger'
import { OrderId } from 'generated/prisma/types'

export class CreatePaymentDto {
  @ApiProperty({ type: String })
  orderId!: OrderId
  savedCardId?: string
  cardNumber?: string | null
  expiryMonth?: number | null
  expiryYear?: number | null
  cvv?: string
  cardholderName?: string | null
  save?: boolean | null
}
