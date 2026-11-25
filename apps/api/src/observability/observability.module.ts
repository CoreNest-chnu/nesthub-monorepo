import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
} from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { FailRateInterceptor } from './fail-rate.interceptor'
import { MetricsController } from './metrics.controller'
import { requestObserver } from './request-observer.middleware'

// Metrics (GET /metrics), JSON request logs and the FAIL_RATE failure injection.
@Module({
  controllers: [MetricsController],
  providers: [
    { provide: APP_INTERCEPTOR, useFactory: () => new FailRateInterceptor() },
  ],
})
export class ObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(requestObserver).forRoutes('*')
  }
}
