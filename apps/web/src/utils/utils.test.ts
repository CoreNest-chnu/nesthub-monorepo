import { describe, expect, it } from 'bun:test'
import { cn } from '../lib/utils'
import { formatDate } from './date.util'
import { isValidImageUrl } from './url.util'

describe('formatDate', () => {
  it('formats an ISO date as YYYY-MM-DD', () => {
    expect(formatDate('2026-06-23T18:08:05.535Z')).toBe('2026-06-23')
  })

  it('returns an empty string for null', () => {
    expect(formatDate(null)).toBe('')
  })

  it('returns an empty string for an invalid date', () => {
    expect(formatDate('not a date')).toBe('')
  })
})

describe('isValidImageUrl', () => {
  it('accepts an absolute URL', () => {
    expect(isValidImageUrl('https://example.com/image.png')).toBe(true)
  })

  it('rejects a relative path', () => {
    expect(isValidImageUrl('/images/a.png')).toBe(false)
  })

  it('rejects undefined and empty values', () => {
    expect(isValidImageUrl(undefined)).toBe(false)
    expect(isValidImageUrl('')).toBe(false)
  })
})

describe('cn', () => {
  it('lets later Tailwind classes override earlier ones', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('skips falsy values', () => {
    expect(cn('base', false, undefined, 'extra')).toBe('base extra')
  })
})
