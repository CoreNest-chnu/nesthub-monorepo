'use client'

import { Bell, LayoutGrid, Mail, Megaphone, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  type SettingsPrefs,
  useSettingsStore,
} from '@/src/store/useSettingsStore'

type ToggleKey = keyof SettingsPrefs

type ToggleRow = {
  key: ToggleKey
  title: string
  description: string
  icon: React.ReactNode
}

const rows: ToggleRow[] = [
  {
    key: 'emailNotifications',
    title: 'Email-сповіщення',
    description: 'Отримувати листи про активність акаунта',
    icon: <Mail size={18} />,
  },
  {
    key: 'orderUpdates',
    title: 'Оновлення замовлень',
    description: 'Сповіщати про зміну статусу ваших замовлень',
    icon: <Bell size={18} />,
  },
  {
    key: 'promoEmails',
    title: 'Акції та новини',
    description: 'Розсилка з промокодами та знижками',
    icon: <Megaphone size={18} />,
  },
  {
    key: 'compactCatalog',
    title: 'Компактний каталог',
    description: 'Щільніше відображення карток товарів',
    icon: <LayoutGrid size={18} />,
  },
]

const Switch: React.FC<{ checked: boolean; onToggle: () => void }> = ({
  checked,
  onToggle,
}) => (
  <button
    type={'button'}
    role={'switch'}
    aria-checked={checked}
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
      checked ? 'bg-gray-900' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
)

type SettingRowProps = {
  row: ToggleRow
  checked: boolean
  onToggle: (key: ToggleKey) => void
}

const SettingRow: React.FC<SettingRowProps> = ({ row, checked, onToggle }) => {
  const handleToggle = useCallback(
    () => onToggle(row.key),
    [onToggle, row.key],
  )

  return (
    <div className={'flex items-center justify-between gap-4 p-4'}>
      <div className={'flex items-center gap-3'}>
        <div
          className={
            'flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500'
          }
        >
          {row.icon}
        </div>
        <div>
          <p className={'font-medium text-gray-900'}>{row.title}</p>
          <p className={'text-sm text-gray-500'}>{row.description}</p>
        </div>
      </div>
      <Switch checked={checked} onToggle={handleToggle} />
    </div>
  )
}

export default function SettingsPage() {
  const prefs = useSettingsStore()
  const toggle = useSettingsStore((s) => s.toggle)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleClearLocalData = useCallback(() => {
    const keys = ['nesthub-favorites', 'nesthub-addresses', 'nesthub-settings']
    for (const key of keys) {
      localStorage.removeItem(key)
    }
    toast.success('Локальні дані очищено')
    setTimeout(() => window.location.reload(), 600)
  }, [])

  return (
    <div className={'flex flex-col gap-6'}>
      <div>
        <h2 className={'text-xl font-semibold text-gray-900'}>
          {'Налаштування'}
        </h2>
        <p className={'mt-1 text-sm text-gray-500'}>
          {
            'Керуйте сповіщеннями та відображенням. Зміни зберігаються автоматично.'
          }
        </p>
      </div>

      <div
        className={
          'divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white'
        }
      >
        {rows.map((row) => (
          <SettingRow
            key={row.key}
            row={row}
            checked={mounted ? prefs[row.key] : false}
            onToggle={toggle}
          />
        ))}
      </div>

      <div className={'rounded-2xl border border-red-100 bg-red-50/50 p-4'}>
        <div className={'flex items-start justify-between gap-4'}>
          <div>
            <p className={'font-medium text-gray-900'}>
              {'Очистити локальні дані'}
            </p>
            <p className={'mt-0.5 text-sm text-gray-500'}>
              {
                'Видалити обране, збережені адреси та налаштування з цього браузера'
              }
            </p>
          </div>
          <button
            type={'button'}
            onClick={handleClearLocalData}
            className={
              'inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
            }
          >
            <Trash2 size={16} />
            {'Очистити'}
          </button>
        </div>
      </div>
    </div>
  )
}
