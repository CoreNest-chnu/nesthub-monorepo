import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
