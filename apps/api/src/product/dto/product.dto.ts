import { Type } from 'class-transformer'
import { CategoryId } from 'generated/prisma/types'

export class PaginationQueryDto {
  @Type(() => Number)
  page?: number

  @Type(() => Number)
  take?: number

  categoryId: CategoryId
}
