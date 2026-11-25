import { Controller, Get, Header } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { registry } from './http-metrics'

// Scraped by Prometheus through the ServiceMonitor in the Helm chart.
// Hidden from Swagger so the generated api-client does not change.
@ApiExcludeController()
@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', registry.contentType)
  metrics() {
    return registry.metrics()
  }
}
