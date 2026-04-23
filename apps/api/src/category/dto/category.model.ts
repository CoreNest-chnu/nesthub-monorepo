import { ApiProperty } from '@nestjs/swagger'
import { CategoryId } from 'generated/prisma/types'

export class CategoryModel {
  @ApiProperty({ type: String })
  id!: CategoryId
  name!: string
  createdAt!: Date
  updatedAt!: Date
}
