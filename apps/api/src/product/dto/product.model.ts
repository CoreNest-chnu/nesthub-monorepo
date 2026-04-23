import { Decimal } from 'generated/prisma/internal/prismaNamespace'
import { ProductId } from 'generated/prisma/types'
import { CategoryModel } from 'src/category/dto/category.model'

export class ProductModel {
  id!: ProductId
  name!: string
  description!: string | null
  price!: Decimal
  imageUrl!: string | null
  stock!: number
  categoryId!: string
  createdAt!: Date
  updatedAt!: Date
}

type ProductWithCategory = ProductModel & {
  category: CategoryModel
}

export class PaginatedResponseDto {
  products!: ProductWithCategory[]
  total!: number
  page!: number
  take!: number
  totalPages!: number
}
