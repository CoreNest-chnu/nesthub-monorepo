'use client'

import { useCategoriesControllerFindAll } from '@repo/api-client'
import { SlidersHorizontal, Star } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Input } from '@/src/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group'
import { useCatalogFilters } from '@/src/hooks/useCatalogFilters'

type SetFilters = ReturnType<typeof useCatalogFilters>[1]

type FilterSectionProps = {
  title: string
  children: React.ReactNode
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => (
  <div className={'flex flex-col gap-2'}>
    <h3 className={'text-sm font-semibold text-gray-900'}>{title}</h3>
    {children}
  </div>
)

const ratings = [5, 4, 3, 2, 1]

const Stars: React.FC<{ filled: number }> = ({ filled }) => (
  <span className={'flex items-center gap-0.5'}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        // biome-ignore lint/suspicious/noArrayIndexKey: static 5-star list, order is stable
        key={i}
        size={16}
        className={
          i < filled
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }
      />
    ))}
  </span>
)

const categorySkeletonKeys = Array.from({ length: 6 }, () =>
  crypto.randomUUID(),
)

type PriceInputProps = {
  filterKey: 'priceFrom' | 'priceTo'
  value: number | null
  placeholder: string
  setFilters: SetFilters
}

const PriceInput: React.FC<PriceInputProps> = ({
  filterKey,
  value,
  placeholder,
  setFilters,
}) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value

      if (next === '') {
        setFilters({ [filterKey]: null, page: 1 })

        return
      }

      const parsed = Number(next)

      if (Number.isNaN(parsed) || parsed < 0) {
        return
      }

      setFilters({ [filterKey]: parsed, page: 1 })
    },
    [filterKey, setFilters],
  )

  return (
    <Input
      type={'number'}
      min={0}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={handleChange}
      className={'rounded-sm bg-white'}
    />
  )
}

type RatingItemProps = {
  value: number
  selected: boolean
  ratings: number[]
  setFilters: SetFilters
}

const RatingItem: React.FC<RatingItemProps> = ({
  value,
  selected,
  ratings: current,
  setFilters,
}) => {
  const handleToggle = useCallback(() => {
    const next = current.includes(value)
      ? current.filter((r) => r !== value)
      : [...current, value]

    setFilters({ rating: next, page: 1 })
  }, [value, current, setFilters])

  const id = `rating-${value}`

  return (
    <div className={'flex items-center gap-2'}>
      <Checkbox id={id} checked={selected} onCheckedChange={handleToggle} />
      <label
        htmlFor={id}
        className={'text-sm text-gray-700 cursor-pointer select-none'}
      >
        <Stars filled={value} />
      </label>
    </div>
  )
}

type StockItemProps = {
  id: string
  label: string
  value: boolean
  current: boolean | null
  setFilters: SetFilters
}

const StockItem: React.FC<StockItemProps> = ({
  id,
  label,
  value,
  current,
  setFilters,
}) => {
  const handleToggle = useCallback(() => {
    setFilters({ stock: current === value ? null : value, page: 1 })
  }, [current, value, setFilters])

  return (
    <div className={'flex items-center gap-2'}>
      <Checkbox
        id={id}
        checked={current === value}
        onCheckedChange={handleToggle}
      />
      <label
        htmlFor={id}
        className={'text-sm text-gray-700 cursor-pointer select-none'}
      >
        {label}
      </label>
    </div>
  )
}

type Category = { id: string; name: string }

type CategorySectionProps = {
  isLoading: boolean
  categories: Category[]
  categoryId: string | null
  setFilters: SetFilters
}

const CategorySection: React.FC<CategorySectionProps> = ({
  isLoading,
  categories,
  categoryId,
  setFilters,
}) => {
  const handleChange = useCallback(
    (value: string) => {
      setFilters({ categoryId: value || null, page: 1 })
    },
    [setFilters],
  )

  if (isLoading) {
    return (
      <div className={'grid grid-cols-2 gap-2'}>
        {categorySkeletonKeys.map((key) => (
          <div key={key} className={'h-4 bg-gray-200 rounded animate-pulse'} />
        ))}
      </div>
    )
  }

  if (categories.length === 0) {
    return <p className={'text-sm text-gray-400'}>{'Категорій не знайдено'}</p>
  }

  return (
    <RadioGroup
      value={categoryId ?? ''}
      onValueChange={handleChange}
      className={'grid-cols-2'}
    >
      {categories.map((category) => {
        const id = `category-${category.id}`

        return (
          <div key={category.id} className={'flex items-center gap-2'}>
            <RadioGroupItem id={id} value={category.id} />
            <label
              htmlFor={id}
              className={
                'text-sm text-gray-700 cursor-pointer select-none truncate'
              }
            >
              {category.name}
            </label>
          </div>
        )
      })}
    </RadioGroup>
  )
}

export const Filters: React.FC = () => {
  const [{ categoryId, priceFrom, priceTo, rating, stock }, setFilters] =
    useCatalogFilters()
  const { data, isLoading } = useCategoriesControllerFindAll()
  const categories = data?.data ?? []

  const [open, setOpen] = useState(false)
  const toggleOpen = useCallback(() => setOpen((prev) => !prev), [])

  const hasActiveFilters =
    categoryId !== null ||
    priceFrom !== null ||
    priceTo !== null ||
    rating.length > 0 ||
    stock !== null

  const handleClear = useCallback(() => {
    setFilters({
      categoryId: null,
      priceFrom: null,
      priceTo: null,
      rating: [],
      stock: null,
      page: 1,
    })
  }, [setFilters])

  return (
    <aside
      className={
        'w-full rounded-2xl border border-gray-200 bg-white p-4 lg:w-64 lg:shrink-0 lg:self-start lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto lg:rounded-none lg:border-0 lg:border-r lg:bg-transparent lg:p-4'
      }
    >
      <div className={'flex items-center justify-between gap-2'}>
        <h2 className={'text-base font-semibold text-gray-900'}>{'Фільтри'}</h2>
        <button
          type={'button'}
          onClick={toggleOpen}
          className={
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100 lg:hidden'
          }
        >
          <SlidersHorizontal size={16} />
          {open ? 'Сховати' : 'Показати'}
        </button>
      </div>

      <div
        className={`${open ? 'flex' : 'hidden'} mt-4 flex-col gap-6 lg:mt-6 lg:flex`}
      >
      <FilterSection title={'Ціна (грн)'}>
        <div className={'flex items-center gap-2'}>
          <PriceInput
            filterKey={'priceFrom'}
            value={priceFrom}
            placeholder={'Від'}
            setFilters={setFilters}
          />
          <PriceInput
            filterKey={'priceTo'}
            value={priceTo}
            placeholder={'До'}
            setFilters={setFilters}
          />
        </div>
      </FilterSection>

      <FilterSection title={'Категорія'}>
        <CategorySection
          isLoading={isLoading}
          categories={categories}
          categoryId={categoryId}
          setFilters={setFilters}
        />
      </FilterSection>

      <FilterSection title={'Рейтинг'}>
        {ratings.map((r) => (
          <RatingItem
            key={r}
            value={r}
            selected={rating.includes(r)}
            ratings={rating}
            setFilters={setFilters}
          />
        ))}
      </FilterSection>

      <FilterSection title={'Наявність'}>
        <StockItem
          id={'stock-in'}
          label={'В наявності'}
          value={true}
          current={stock}
          setFilters={setFilters}
        />
        <StockItem
          id={'stock-out'}
          label={'Немає в наявності'}
          value={false}
          current={stock}
          setFilters={setFilters}
        />
        {hasActiveFilters && (
          <Button
            variant={'ghost'}
            size={'sm'}
            className={'py-2 cursor-pointer bg-white'}
            onClick={handleClear}
          >
            {'Очистити'}
          </Button>
        )}
      </FilterSection>
      </div>
    </aside>
  )
}
