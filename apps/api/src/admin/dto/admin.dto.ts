import { IsPositive, IsUrl, Min } from 'class-validator'

export class CreateProductDto {
  name!: string
  description?: string
  categoryId!: string

  @IsPositive()
  price!: number

  @Min(0)
  stock!: number

  @IsUrl()
  imageUrl?: string
}

export class UpdateProductDto {
  name?: string
  description?: string
  categoryId?: string
  imageUrl?: string

  price?: number
  stock?: number
  rating?: number
}
