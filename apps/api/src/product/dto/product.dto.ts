import { Type } from 'class-transformer'

export class PaginationQueryDto {
  @Type(() => Number)
  page?: number

  @Type(() => Number)
  take?: number
}
