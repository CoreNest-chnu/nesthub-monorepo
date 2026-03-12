import { Injectable } from '@nestjs/common'
import { prisma } from 'prisma/lib/prisma'

@Injectable()
export class AppService {
  async createUser(name: string, email: string) {
    const us = 'test' as string

    console.log(us)

    return prisma.user.create({ data: { name, email } })
  }
}
