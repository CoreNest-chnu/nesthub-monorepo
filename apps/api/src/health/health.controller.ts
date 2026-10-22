import { hostname } from 'node:os'
import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { PrismaService } from 'prisma/lib/prisma'

// Probes for Kubernetes. Hidden from Swagger so the generated api-client
// does not change.
@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  // Liveness: the process is up. Does not touch the database, so a DB outage
  // does not make Kubernetes restart every API pod.
  // `pod` and `version` show which replica / image version answered.
  @Get()
  live() {
    return {
      status: 'ok',
      version: process.env.APP_VERSION ?? 'dev',
      pod: hostname(),
    }
  }

  // Readiness: the pod can serve traffic only when the database answers.
  @Get('ready')
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
    } catch {
      throw new ServiceUnavailableException('Database is not reachable')
    }

    return { status: 'ready' }
  }
}
