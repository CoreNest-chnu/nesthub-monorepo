import { ApiProperty } from '@nestjs/swagger'

export class CategoryResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class ProductResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty({ nullable: true })
  description!: string | null

  @ApiProperty()
  price!: string

  @ApiProperty({ nullable: true })
  imageUrl!: string | null

  @ApiProperty()
  stock!: number

  @ApiProperty()
  categoryId!: string

  @ApiProperty({ type: () => CategoryResponseDto })
  category!: CategoryResponseDto

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}

export class PaginatedProductResponseDto {
  @ApiProperty({ type: () => [ProductResponseDto] })
  products!: ProductResponseDto[]

  @ApiProperty()
  total!: number

  @ApiProperty()
  page!: number

  @ApiProperty()
  take!: number

  @ApiProperty()
  totalPages!: number
}
