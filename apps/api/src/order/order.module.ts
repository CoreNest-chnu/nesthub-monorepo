import { Module } from '@nestjs/common'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { PrismaService } from 'prisma/lib/prisma'
import { PromoModule } from '../promo/promo.module'

@Module({
  imports: [PromoModule],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
