import { Module } from '@nestjs/common'
import { PromoController } from './promo.controller'
import { PromoService } from './promo.service'
import { PrismaService } from 'prisma/lib/prisma'

@Module({
  controllers: [PromoController],
  providers: [PromoService, PrismaService],
})
export class PromoModule {}
