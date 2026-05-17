import { ApiProperty } from '@nestjs/swagger'

export class ShippingAddressDto {
  city!: string
  street!: string
  building!: string
  zip!: string

  @ApiProperty({ required: false })
  promoCode?: string
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  shippingAddress!: ShippingAddressDto
}
