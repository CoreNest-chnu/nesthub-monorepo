import type { PromoResultModel } from '@repo/api-client'
import { z } from 'zod'

const storageKey = 'applied-promo'

const promoResultSchema = z.object({
  code: z.string(),
  discountAmount: z.string(),
  finalTotal: z.string(),
}) satisfies z.ZodType<PromoResultModel>

export const readAppliedPromo = (): PromoResultModel | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.sessionStorage.getItem(storageKey)

  if (!raw) {
    return null
  }

  const parsed = promoResultSchema.safeParse(JSON.parse(raw))

  return parsed.success ? parsed.data : null
}

export const writeAppliedPromo = (promo: PromoResultModel): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(storageKey, JSON.stringify(promo))
}

export const clearAppliedPromo = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(storageKey)
}
