import { Injectable } from '@nestjs/common'
import { prisma } from 'prisma/lib/prisma'

@Injectable()
export class AppService {
  async createUser(name: string, email: string) {
    return prisma.user.create({ data: { name, email } })
  }
}
