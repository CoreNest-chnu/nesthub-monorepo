import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './auth.strategy'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [PassportModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
