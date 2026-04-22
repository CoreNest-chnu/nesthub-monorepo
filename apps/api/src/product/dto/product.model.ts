import { Prisma } from 'generated/prisma/browser'

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true }
}>

export class PaginatedResponseDto {
  products!: ProductWithCategory[]
  total!: number
  page!: number
  take!: number
  totalPages!: number
}
