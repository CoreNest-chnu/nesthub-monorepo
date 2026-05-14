import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'generated/prisma/browser'
import { ShippingAddressDto } from '../dto/order.dto'

function isJsonObject(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function toShippingAddressDto(
  value: Prisma.JsonValue,
): ShippingAddressDto {
  if (!isJsonObject(value)) {
    throw new BadRequestException('Invalid shipping address')
  }

  const { city, street, building, zip } = value

  if (
    typeof city !== 'string' ||
    typeof street !== 'string' ||
    typeof building !== 'string' ||
    typeof zip !== 'string'
  ) {
    throw new BadRequestException('Invalid shipping address')
  }

  return {
    city,
    street,
    building,
    zip,
  }
}
