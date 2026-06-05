'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Address = {
  id: string
  label: string
  city: string
  street: string
  building: string
  zip: string
  isDefault: boolean
}

export type AddressInput = Omit<Address, 'id' | 'isDefault'>

type AddressState = {
  items: Address[]
  add: (input: AddressInput) => void
  update: (id: string, input: AddressInput) => void
  remove: (id: string) => void
  setDefault: (id: string) => void
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `addr_${Date.now()}_${Math.random().toString(36).slice(2)}`

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      items: [],

      add: (input) =>
        set((state) => {
          const isFirst = state.items.length === 0

          return {
            items: [
              ...state.items,
              { ...input, id: createId(), isDefault: isFirst },
            ],
          }
        }),

      update: (id, input) =>
        set((state) => ({
          items: state.items.map((a) => (a.id === id ? { ...a, ...input } : a)),
        })),

      remove: (id) =>
        set((state) => {
          const next = state.items.filter((a) => a.id !== id)
          // If we removed the default and others remain, promote the first one.
          const hasDefault = next.some((a) => a.isDefault)

          return {
            items: next.map((a, index) =>
              !hasDefault && index === 0 ? { ...a, isDefault: true } : a,
            ),
          }
        }),

      setDefault: (id) =>
        set((state) => ({
          items: state.items.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
    }),
    { name: 'nesthub-addresses' },
  ),
)
