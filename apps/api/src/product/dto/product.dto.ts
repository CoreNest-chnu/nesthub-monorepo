import { Decimal } from '@prisma/client/runtime/index-browser'
import { Type } from 'class-transformer'
import { IsInt, Min, Max } from 'class-validator'

import { Category, Product } from 'generated/prisma/browser'
import { ProductId } from 'generated/prisma/types'

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number 

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number
}

export class PaginatedResponseDto {
  items!: (Product & { category?: Category })[]
  total!: number
  page!: number
  take!: number
  totalPages!: number
}

export class ProductResponseDto {
  id!: ProductId
  name!: string
  description: string | null

  price!: Decimal
  imageUrl: string | null
  stock!: number

  categoryId!: string
  category: Category

  createdAt!: Date
  updatedAt!: Date
}
