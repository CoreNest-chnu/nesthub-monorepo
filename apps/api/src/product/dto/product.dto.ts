import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import type { CategoryId } from 'generated/prisma/types'

export class PaginationQueryDto {
  @Type(() => Number)
  page?: number

  @Type(() => Number)
  take?: number

  @ApiProperty({ type: String })
  categoryId?: CategoryId

  search?: string

  @ApiProperty({ type: Number, isArray: true, required: false })
  rating?: number[]

  @ApiProperty({ type: Boolean, required: false })
  stock?: boolean

  @Type(() => Number)
  priceFrom?: number

  @Type(() => Number)
  priceTo?: number
}
