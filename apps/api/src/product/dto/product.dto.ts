import { Decimal } from '@prisma/client/runtime/index-browser'
import { Type } from 'class-transformer'
import { IsInt, Min, Max } from 'class-validator'
import { Category } from 'generated/prisma/browser'

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number
}

export class PaginatedResponseDto<T> {
  items!: T[]
  total!: number
  page!: number
  limit!: number
  totalPages!: number
}

export class ProductResponseDto {
  id!: string
  name!: string
  description?: string | null

  price!: Decimal
  imageUrl?: string | null
  stock!: number

  categoryId!: string
  category?: Category

  createdAt!: Date
  updatedAt!: Date
}
