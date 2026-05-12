import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}
}
