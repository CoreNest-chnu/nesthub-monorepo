import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from 'generated/prisma/client'

export class PromoResultModel {
  code!: string

  @ApiProperty({ type: String })
  discountAmount!: Prisma.Decimal

  @ApiProperty({ type: String })
  finalTotal!: Prisma.Decimal
}
