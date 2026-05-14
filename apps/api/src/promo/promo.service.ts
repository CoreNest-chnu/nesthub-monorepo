import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { Prisma } from 'generated/prisma/client'
import { UserId } from 'generated/prisma/types'
import { PromoResultModel } from './dto/promo.model'

type ApplyArgs = {
  userId: UserId
  code: string
}

@Injectable()
export class PromoService {
  constructor(private readonly prisma: PrismaService) {}

  async apply({ userId, code }: ApplyArgs): Promise<PromoResultModel> {
    const promo = await this.prisma.promoCode.findUnique({
      where: { code },
    })

    if (!promo?.isActive) {
      throw new NotFoundException('Невірний промокод')
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      throw new BadRequestException('Промокод протермінований')
    }

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { Items: { include: { Product: true } } },
    })

    if (!cart || cart.Items.length === 0) {
      throw new BadRequestException('Кошик порожній')
    }

    const subtotal = cart.Items.reduce(
      (sum, { Product, quantity }) => sum.add(Product.price.mul(quantity)),
      new Prisma.Decimal(0),
    )

    const discountAmount = (() => {
      if (promo.discountPercent !== null) {
        return subtotal.mul(promo.discountPercent).div(100)
      }

      if (promo.discountAmount !== null) {
        return Prisma.Decimal.min(promo.discountAmount, subtotal)
      }
      throw new BadRequestException('Невірна конфігурація промокоду')
    })()

    const finalTotal = subtotal.sub(discountAmount)

    return {
      code: promo.code,
      discountAmount,
      finalTotal,
    }
  }
}
