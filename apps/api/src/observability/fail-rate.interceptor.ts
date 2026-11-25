import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  InternalServerErrorException,
  type NestInterceptor,
} from '@nestjs/common'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import { isServiceRoute, pathOf } from './request-observer.middleware'

// Share of requests that fail with 500 on purpose, from the FAIL_RATE env var
// (0..1). It simulates a bad release for the metric-based rollback demo.
// An interceptor runs after routing, so the failed requests keep their real
// route label in metrics and logs. Probes and /metrics never fail, so the pods
// stay Ready and the bad version is caught by the analysis, not by Kubernetes.
@Injectable()
export class FailRateInterceptor implements NestInterceptor {
  constructor(
    private readonly failRate = Number(process.env.FAIL_RATE ?? 0) || 0,
    private readonly random: () => number = Math.random,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>()

    if (
      this.failRate > 0 &&
      !isServiceRoute(pathOf(req)) &&
      this.random() < this.failRate
    ) {
      throw new InternalServerErrorException('Injected failure (FAIL_RATE)')
    }

    return next.handle()
  }
}
