import { Counter, Histogram, Registry } from 'prom-client'

// Own registry instead of the global one, so tests can create the app several
// times without "metric already registered" errors.
export const registry = new Registry()

// Labels have low cardinality only: `route` is the route template
// (/products/:id), never the real URL with ids.
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'HTTP requests handled by the API',
  labelNames: ['method', 'route', 'status'] as const,
  registers: [registry],
})

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [registry],
})
