import { ServiceUnavailableException } from '@nestjs/common'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  const queryRaw = jest.fn()
  const controller = new HealthController({ $queryRaw: queryRaw } as never)

  afterEach(() => {
    queryRaw.mockReset()
    delete process.env.APP_VERSION
  })

  it('reports the image version and the pod name', () => {
    process.env.APP_VERSION = '1.1.0'

    expect(controller.live()).toEqual({
      status: 'ok',
      version: '1.1.0',
      pod: expect.any(String),
    })
  })

  it('falls back to "dev" when APP_VERSION is not set', () => {
    expect(controller.live().version).toBe('dev')
  })

  it('is ready when the database answers', async () => {
    queryRaw.mockResolvedValue([{ '?column?': 1 }])

    await expect(controller.ready()).resolves.toEqual({ status: 'ready' })
  })

  it('returns 503 when the database is down', async () => {
    queryRaw.mockRejectedValue(new Error('connection refused'))

    await expect(controller.ready()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    )
  })
})
