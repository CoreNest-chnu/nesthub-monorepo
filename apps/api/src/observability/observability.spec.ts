import {
  Controller,
  Get,
  type INestApplication,
  Module,
  Param,
} from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { FailRateInterceptor } from './fail-rate.interceptor'
import { registry } from './http-metrics'
import { ObservabilityModule } from './observability.module'

@Controller('items')
class ItemsController {
  @Get(':id')
  item(@Param('id') id: string) {
    return { id }
  }
}

@Controller('health')
class HealthStubController {
  @Get()
  live() {
    return { status: 'ok' }
  }
}

@Module({ controllers: [ItemsController, HealthStubController] })
class StubModule {}

// FAIL_RATE is read when the module creates the interceptor, as in the pod.
async function createApp(failRate?: string) {
  if (failRate === undefined) delete process.env.FAIL_RATE
  else process.env.FAIL_RATE = failRate
  const moduleRef = await Test.createTestingModule({
    imports: [StubModule, ObservabilityModule],
  }).compile()
  const app = moduleRef.createNestApplication({ logger: false })
  await app.init()
  return app
}

const metricsText = async (app: INestApplication) =>
  (await request(app.getHttpServer()).get('/metrics').expect(200)).text

describe('ObservabilityModule', () => {
  let app: INestApplication
  let stdout: jest.SpyInstance

  beforeEach(() => {
    registry.resetMetrics()
    stdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  afterEach(async () => {
    stdout.mockRestore()
    delete process.env.FAIL_RATE
    await app?.close()
  })

  it('counts requests by route template, not by URL', async () => {
    app = await createApp()
    await request(app.getHttpServer()).get('/items/1').expect(200)
    await request(app.getHttpServer()).get('/items/2?x=1').expect(200)

    const text = await metricsText(app)
    expect(text).toContain(
      'http_requests_total{method="GET",route="/items/:id",status="200"} 2',
    )
    expect(text).toContain(
      'http_request_duration_seconds_bucket{le="0.005",method="GET",route="/items/:id"}',
    )
    expect(text).not.toContain('/items/1')
  })

  it('labels unknown URLs as unmatched', async () => {
    app = await createApp()
    await request(app.getHttpServer()).get('/no/such/page').expect(404)

    expect(await metricsText(app)).toContain(
      'route="unmatched",status="404"} 1',
    )
  })

  it('does not count probes and the scrape itself', async () => {
    app = await createApp()
    await request(app.getHttpServer()).get('/health').expect(200)
    await metricsText(app)

    expect(await metricsText(app)).not.toMatch(/http_requests_total\{/)
  })

  it('writes one JSON log line per request', async () => {
    app = await createApp()
    await request(app.getHttpServer()).get('/items/7').expect(200)

    const line = stdout.mock.calls
      .map(([chunk]) => String(chunk))
      .find((c) => c.includes('"msg":"request"'))
    expect(JSON.parse(line ?? '')).toMatchObject({
      level: 'info',
      msg: 'request',
      method: 'GET',
      route: '/items/:id',
      status: 200,
      duration_ms: expect.any(Number),
      time: expect.any(String),
    })
  })

  it('fails requests with FAIL_RATE, but never probes or /metrics', async () => {
    app = await createApp('1')
    await request(app.getHttpServer()).get('/items/1').expect(500)
    await request(app.getHttpServer()).get('/health').expect(200)

    const text = await metricsText(app)
    expect(text).toContain('route="/items/:id",status="500"} 1')
    const errorLine = stdout.mock.calls
      .map(([chunk]) => String(chunk))
      .find((c) => c.includes('"status":500'))
    expect(JSON.parse(errorLine ?? '')).toMatchObject({
      level: 'error',
      route: '/items/:id',
    })
  })

  it('ignores an invalid FAIL_RATE', async () => {
    app = await createApp('abc')
    await request(app.getHttpServer()).get('/items/1').expect(200)
  })
})

describe('FailRateInterceptor', () => {
  const context = (url: string) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ originalUrl: url }) }),
    }) as never
  const next = { handle: jest.fn(() => 'passed') } as never

  it('fails a request when the random draw is below FAIL_RATE', () => {
    const interceptor = new FailRateInterceptor(0.5, () => 0.4)
    expect(() => interceptor.intercept(context('/products'), next)).toThrow(
      'Injected failure',
    )
  })

  it('passes a request when the random draw is above FAIL_RATE', () => {
    const interceptor = new FailRateInterceptor(0.5, () => 0.6)
    expect(interceptor.intercept(context('/products'), next)).toBe('passed')
  })

  it('never fails /health/ready, so a bad version still becomes Ready', () => {
    const interceptor = new FailRateInterceptor(1, () => 0)
    expect(interceptor.intercept(context('/health/ready'), next)).toBe('passed')
  })
})
