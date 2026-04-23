'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
  Settings,
  LogIn,
} from 'lucide-react'
import { Container } from './Container'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce'
import { useSession } from 'next-auth/react'
import { useCategoriesControllerFindAll } from '@repo/api-client'
import { useCatalogFilters } from '@/src/hooks/useCatalogFilters'

type NavAction = {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}

const catalogPath = '/catalog'

const CategoryNav: React.FC = () => {
  const [filters, setFilters] = useCatalogFilters()
  const { data } = useCategoriesControllerFindAll()
  const categories = data?.data ?? []

  const handleClick = useCallback(
    (id: string) => () => {
      setFilters({
        categoryId: filters.categoryId === id ? null : id,
        page: 1,
      })
    },
    [filters.categoryId, setFilters],
  )

  if (categories.length === 0) {
    return null
  }

  return (
    <nav
      className={
        'flex flex-wrap items-center gap-x-6 gap-y-2 pb-3 text-sm font-medium'
      }
    >
      {categories.map((category) => {
        const isActive = filters.categoryId === category.id

        return (
          <button
            key={category.id}
            type={'button'}
            onClick={handleClick(category.id)}
            className={`hover:underline cursor-pointer ${
              isActive ? 'text-blue-800 underline' : 'text-blue-600'
            }`}
          >
            {category.name}
          </button>
        )
      })}
    </nav>
  )
}

const searchDebounceMs = 300

const CatalogSearch: React.FC = () => {
  const [filters, setFilters] = useCatalogFilters()
  const [value, setValue] = useState(filters.search)

  const debouncedCommit = useMemo(
    () =>
      debounce((next: string) => {
        setFilters({ search: next, page: 1 })
      }, searchDebounceMs),
    [setFilters],
  )

  useEffect(() => () => debouncedCommit.cancel(), [debouncedCommit])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      debouncedCommit(e.target.value)
    },
    [debouncedCommit],
  )

  return (
    <div className={'relative flex-1'}>
      <Input
        type={'search'}
        placeholder={'Пошук товарів...'}
        className={'h-11 rounded-lg bg-muted/60 pr-12 pl-4'}
        value={value}
        onChange={handleChange}
      />
      <Button
        variant={'ghost'}
        size={'icon-sm'}
        aria-label={'Шукати'}
        className={
          'absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md cursor-pointer'
        }
      >
        <Search />
      </Button>
    </div>
  )
}

export const Header: React.FC = () => {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const isAdmin = session?.user.role === 'admin'
  const isUnauthenticated = status === 'unauthenticated'
  const isCatalog = pathname === catalogPath

  const actions: NavAction[] = useMemo(
    () => [
      { href: '/catalog', label: 'Каталог', icon: <LayoutGrid /> },
      { href: '/favorites', label: 'Обране', icon: <Heart />, badge: 0 },
      { href: '/cart', label: 'Кошик', icon: <ShoppingCart />, badge: 0 },
      isUnauthenticated
        ? { href: '/login', label: 'Вхід', icon: <LogIn /> }
        : { href: '/profile', label: 'Профіль', icon: <User /> },
      ...(isAdmin
        ? [{ href: '/admin', label: 'Адмін', icon: <Settings /> }]
        : []),
    ],
    [isAdmin, isUnauthenticated],
  )

  return (
    <header
      className={
        'sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm'
      }
    >
      <Container>
        <div className={'flex items-center gap-6 py-4'}>
          <Link
            href={'/'}
            className={
              'flex h-12 items-center justify-center rounded-xl bg-black px-5 text-lg font-bold '
            }
          >
            <p className={'text-white'}>{'NestHub'}</p>
          </Link>

          {isCatalog ? <CatalogSearch /> : <div className={'flex-1'} />}

          <nav className={'flex items-center gap-2'}>
            {actions.map(({ href, icon, badge, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  'flex min-w-14 flex-col items-center gap-1 rounded-md px-2 py-1 text-xs text-foreground hover:bg-muted'
                }
              >
                <span className={'relative'}>
                  <span className={'block size-6 [&_svg]:size-6'}>{icon}</span>
                  {badge !== undefined && (
                    <span
                      className={
                        'absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white'
                      }
                    >
                      {badge}
                    </span>
                  )}
                </span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {isCatalog && <CategoryNav />}
      </Container>
    </header>
  )
}
