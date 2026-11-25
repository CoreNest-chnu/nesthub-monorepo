import { hostname } from 'node:os'
import type { NextFunction, Request, Response } from 'express'
import { httpRequestDuration, httpRequestsTotal } from './http-metrics'

// Probes and the scrape itself are not business traffic: counting them would
// hide the real request rate and fill the logs.
export const isServiceRoute = (path: string) =>
  path === '/metrics' || path === '/health' || path.startsWith('/health/')

// Path without the query string. originalUrl, not req.path: inside a mounted
// middleware req.path is relative to the mount point.
export const pathOf = (req: Request) => req.originalUrl.split('?')[0]

// Route template of the matched handler (/products/:id); Nest registers every
// handler with its full path. Requests that matched no route (404) share one
// label value instead of one per URL.
const routeOf = (req: Request): string => req.route?.path ?? 'unmatched'

const pod = hostname()

// One middleware for both signals of a request: it counts the request and its
// duration in Prometheus metrics and writes one JSON log line to stdout.
export function requestObserver(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (isServiceRoute(pathOf(req))) {
    return next()
  }

  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const seconds = Number(process.hrtime.bigint() - start) / 1e9
    const route = routeOf(req)
    const status = res.statusCode

    httpRequestsTotal.inc({ method: req.method, route, status: String(status) })
    httpRequestDuration.observe({ method: req.method, route }, seconds)

    process.stdout.write(
      `${JSON.stringify({
        time: new Date().toISOString(),
        level: status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info',
        msg: 'request',
        method: req.method,
        route,
        status,
        duration_ms: Math.round(seconds * 10000) / 10,
        version: process.env.APP_VERSION ?? 'dev',
        pod,
      })}\n`,
    )
  })

  next()
}
