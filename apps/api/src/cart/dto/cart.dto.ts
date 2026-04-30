import { ProductId, UserId } from 'generated/prisma/types'

export class itemDTO {
  id: UserId

  productId: ProductId

  qty: number
}
