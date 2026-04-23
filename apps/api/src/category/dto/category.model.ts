import { CategoryId } from 'generated/prisma/types'

export class CategoryModel {
  id!: CategoryId
  name!: string
  createdAt!: Date
  updatedAt!: Date
}
