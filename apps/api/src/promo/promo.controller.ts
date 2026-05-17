import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { CurrentUser } from 'src/user/user.util'
import { User } from 'generated/prisma/browser'
import { PromoService } from './promo.service'
import { ApplyPromoDto } from './dto/promo.dto'
import { PromoResultModel } from './dto/promo.model'

@Controller('promo')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post('apply')
  @ApiResponse({ status: 200, type: PromoResultModel })
  @UseGuards(JwtAuthGuard)
  async apply(
    @CurrentUser() { id }: User,
    @Body() { code }: ApplyPromoDto,
  ): Promise<PromoResultModel> {
    return await this.promoService.apply({ userId: id, code })
  }
}
