import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { CategoryId } from 'generated/prisma/types'

export class PaginationQueryDto {
  @Type(() => Number)
  page?: number

  @Type(() => Number)
  take?: number

  @ApiProperty({ type: String })
  categoryId?: CategoryId

  search?: string
  
  @Type(() => Number)
  rating?: number

  @Type(() => Number)
  stock?: number

  @Type(() => Number)
  priceFrom?: number

  @Type(() => Number)
  priceTo?: number
}
