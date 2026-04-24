'use client'

import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs'
import { useMemo } from 'react'

export const defaultTake = 12

export const useCatalogFilters = () => {
  const [params, setParams] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      take: parseAsInteger.withDefault(defaultTake),
      search: parseAsString.withDefault(''),
      categoryId: parseAsString,
      priceFrom: parseAsInteger,
      priceTo: parseAsInteger,
      rating: parseAsArrayOf(parseAsInteger).withDefault([]),
      stock: parseAsBoolean,
    },
    {
      history: 'replace',
      shallow: true,
      scroll: false,
    },
  )

  return useMemo(() => [params, setParams] as const, [params, setParams])
}
