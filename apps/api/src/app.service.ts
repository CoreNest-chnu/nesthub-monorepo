import { Injectable } from '@nestjs/common'
import { prisma } from 'prisma/lib/prisma'

@Injectable()
export class AppService {
  // FIXME: REMOVE THIS FUNCTION, THIS IS JUST FOR TESTING PURPOSES
  async getUser(name: string, email: string) {
    return prisma.user.findMany({
      where: {
        firstName: name,
        email,
      },
    })
  }
}
