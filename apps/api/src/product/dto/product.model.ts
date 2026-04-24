import { ApiProperty } from '@nestjs/swagger'
import type { Prisma } from 'generated/prisma/client'
import { ProductId } from 'generated/prisma/types'
import { CategoryModel } from 'src/category/dto/category.model'

export class ProductModel {
  @ApiProperty({ type: String })
  id!: ProductId
  name!: string
  description!: string | null

  @ApiProperty({ type: String })
  price!: Prisma.Decimal

  imageUrl!: string | null
  stock!: number
  categoryId!: string

  @ApiProperty({ type: () => CategoryModel })
  category!: CategoryModel

  createdAt!: Date
  updatedAt!: Date
}

export class PaginatedResponseDto {
  @ApiProperty({ type: () => [ProductModel] })
  products!: ProductModel[]
  total!: number
  page!: number
  take!: number
  totalPages!: number
}
