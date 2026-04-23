import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
}
