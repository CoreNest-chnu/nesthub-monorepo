import { ApiProperty } from '@nestjs/swagger'
import { UserId } from 'generated/prisma/types'

export class ShippingAddressDto {
  city!: string
  street!: string
  building!: string
  zip!: string
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  shippingAddress!: ShippingAddressDto
}

export class FindAllByUserArgs {
  userId!: UserId
}
