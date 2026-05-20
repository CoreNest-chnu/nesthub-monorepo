import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}
}
