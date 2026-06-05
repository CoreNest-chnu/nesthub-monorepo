'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SettingsPrefs = {
  emailNotifications: boolean
  promoEmails: boolean
  orderUpdates: boolean
  compactCatalog: boolean
}

type SettingsState = SettingsPrefs & {
  toggle: (key: keyof SettingsPrefs) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      emailNotifications: true,
      promoEmails: false,
      orderUpdates: true,
      compactCatalog: false,

      toggle: (key) =>
        set((state) => {
          const updated: Partial<SettingsPrefs> = {}
          updated[key] = !state[key]

          return updated
        }),
    }),
    { name: 'nesthub-settings' },
  ),
)
