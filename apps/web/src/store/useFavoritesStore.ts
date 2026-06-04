'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProductModel } from '@repo/api-client'

type FavoritesState = {
  items: ProductModel[]
  add: (product: ProductModel) => void
  remove: (productId: string) => void
  toggle: (product: ProductModel) => void
  has: (productId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product) =>
        set((state) => ({
          items: state.items.some((i) => i.id === product.id)
            ? state.items
            : [...state.items, product],
        })),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        })),

      toggle: (product) => {
        if (get().has(product.id)) {
          get().remove(product.id)
        } else {
          get().add(product)
        }
      },

      has: (productId) => get().items.some((i) => i.id === productId),
    }),
    { name: 'nesthub-favorites' },
  ),
)
