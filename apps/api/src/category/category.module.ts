import { Module } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { CategoriesController } from './category.controller'
import { CategoriesService } from './category.service'

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
