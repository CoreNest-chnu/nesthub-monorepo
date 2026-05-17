import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CurrentUser } from 'src/user/user.util'
import { User } from 'generated/prisma/browser'
import { PaymentService } from './payment.service'
import { CreatePaymentDto } from './dto/payment.dto'
import { PaymentModel, SavedCardModel } from './dto/payment.model'

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiResponse({ status: 201, type: PaymentModel })
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() { id }: User,
    @Body() dto: CreatePaymentDto,
  ): Promise<PaymentModel> {
    return await this.paymentService.create({ userId: id, dto })
  }

  @Get('cards')
  @ApiResponse({ status: 200, type: SavedCardModel, isArray: true })
  @UseGuards(JwtAuthGuard)
  async cards(@CurrentUser() { id }: User): Promise<SavedCardModel[]> {
    return await this.paymentService.listCards(id)
  }

  @Delete('cards/:id')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  async deleteCard(
    @CurrentUser() { id }: User,
    @Param('id') cardId: string,
  ): Promise<void> {
    return await this.paymentService.deleteCard(id, cardId)
  }
}
