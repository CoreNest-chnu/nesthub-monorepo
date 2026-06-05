import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import type { UserId } from 'generated/prisma/types'
import { CardBrand, OrderStatus } from 'generated/prisma/enums'
import { CreatePaymentDto } from './dto/payment.dto'
import { PaymentModel, SavedCardModel } from './dto/payment.model'

type CreateArgs = {
  userId: UserId
  dto: CreatePaymentDto
}

type CardSnapshot = {
  last4: string
  brand: CardBrand
  expiryMonth: number
  expiryYear: number
  cardholderName: string
  savedCardId: string | null
}

const detectBrand = (cardNumber: string): CardBrand => {
  if (cardNumber.startsWith('4')) {
    return CardBrand.visa
  }

  if (/^(5[1-5]|2[2-7])/.test(cardNumber)) {
    return CardBrand.mastercard
  }

  return CardBrand.other
}

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async listCards(userId: UserId): Promise<SavedCardModel[]> {
    return await this.prisma.savedCard.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async deleteCard(userId: UserId, cardId: string): Promise<void> {
    const card = await this.prisma.savedCard.findUnique({
      where: { id: cardId },
    })

    if (!card) {
      throw new NotFoundException('Картку не знайдено')
    }

    if (card.userId !== userId) {
      throw new ForbiddenException('Немає доступу до цієї картки')
    }

    await this.prisma.savedCard.delete({ where: { id: cardId } })
  }

  async create({ userId, dto }: CreateArgs): Promise<PaymentModel> {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
      include: { Payment: true },
    })

    if (!order) {
      throw new NotFoundException('Замовлення не знайдено')
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Немає доступу до цього замовлення')
    }

    if (order.Payment) {
      throw new BadRequestException('Замовлення вже оплачене')
    }

    if (order.status !== OrderStatus.pending) {
      throw new BadRequestException(
        'Це замовлення не можна оплатити в поточному статусі',
      )
    }

    const snapshot = dto.savedCardId
      ? await this.snapshotFromSavedCard({ userId, dto })
      : await this.snapshotFromNewCard({ userId, dto })

    return await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          orderId: dto.orderId,
          ...snapshot,
          status: 'succeeded',
        },
      })

      await tx.order.update({
        where: { id: dto.orderId },
        data: { status: OrderStatus.paid },
      })

      return payment
    })
  }

  private async snapshotFromSavedCard({
    userId,
    dto,
  }: CreateArgs): Promise<CardSnapshot> {
    if (!dto.savedCardId) {
      throw new BadRequestException('Не вказана збережена картка')
    }

    if (!dto.cvv) {
      throw new BadRequestException('Введіть CVV')
    }

    const card = await this.prisma.savedCard.findUnique({
      where: { id: dto.savedCardId },
    })

    if (card?.userId !== userId) {
      throw new NotFoundException('Збережена картка не знайдена')
    }

    return {
      last4: card.last4,
      brand: card.brand,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cardholderName: card.cardholderName,
      savedCardId: card.id,
    }
  }

  private async snapshotFromNewCard({
    userId,
    dto,
  }: CreateArgs): Promise<CardSnapshot> {
    const { cardNumber, expiryMonth, expiryYear, cvv, cardholderName, save } =
      dto

    if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardholderName) {
      throw new BadRequestException('Заповніть всі поля картки')
    }

    if (!/^\d{13,19}$/.test(cardNumber)) {
      throw new BadRequestException('Невірний номер картки')
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      throw new BadRequestException('Невірний CVV')
    }

    if (expiryMonth < 1 || expiryMonth > 12) {
      throw new BadRequestException('Невірний місяць експірації')
    }

    const thisYear = new Date().getFullYear()

    if (expiryYear < thisYear || expiryYear > thisYear + 20) {
      throw new BadRequestException('Невірний рік експірації')
    }

    if (!cardholderName.trim()) {
      throw new BadRequestException('Введіть власника картки')
    }

    const cardData = {
      last4: cardNumber.slice(-4),
      brand: detectBrand(cardNumber),
      expiryMonth,
      expiryYear,
      cardholderName: cardholderName.trim(),
    }

    const savedCardId = save
      ? (await this.prisma.savedCard.create({ data: { userId, ...cardData } }))
          .id
      : null

    return { ...cardData, savedCardId }
  }
}
