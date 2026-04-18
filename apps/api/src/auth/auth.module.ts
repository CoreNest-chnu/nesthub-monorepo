import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [],
})
export class AuthModule {}
