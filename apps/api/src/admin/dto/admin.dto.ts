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

class CategoryDto {
  name!: string
}

export class CreateCategoryDto extends CategoryDto {}

export class UpdateCategoryDto extends CategoryDto {}
