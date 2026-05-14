import { ApiProperty } from '@nestjs/swagger'

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
