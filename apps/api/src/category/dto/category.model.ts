import { ApiProperty } from '@nestjs/swagger'
import { CategoryId } from 'generated/prisma/types'

class CategoryCount {
  @ApiProperty({ type: Number })
  Products!: number
}

export class CategoryModel {
  @ApiProperty({ type: String })
  id!: CategoryId
  name!: string
  createdAt!: Date
  updatedAt!: Date
  @ApiProperty({ type: CategoryCount, required: false })
  _count?: CategoryCount
}
