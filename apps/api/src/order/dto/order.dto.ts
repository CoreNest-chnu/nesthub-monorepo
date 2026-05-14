import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class ShippingAddressDto {
  city!: string
  street!: string
  building!: string
  zip!: string
}

export class CreateOrderDto {
  @ApiProperty({ type: ShippingAddressDto })
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto
}
