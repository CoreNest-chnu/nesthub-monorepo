import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { HealthController } from './health.controller'

@Module({
  controllers: [HealthController],
  providers: [PrismaService],
})
export class HealthModule {}
