'use client'

import { Star } from 'lucide-react'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Input } from '@/src/components/ui/input'

type FilterSectionProps = {
  title: string
  children: React.ReactNode
}

type FilterCheckboxProps = {
  id: string
  label: React.ReactNode
}

const brands = ['Samsung', 'Apple', 'Xiaomi', 'Huawei', 'OnePlus']
const memory = ['64 ГБ', '128 ГБ', '256 ГБ', '512 ГБ']
const colors = ['Чорний', 'Білий', 'Синій', 'Сірий']
const ratings = [5, 4, 3, 2, 1]

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => (
  <div className={'flex flex-col gap-2'}>
    <h3 className={'text-sm font-semibold text-gray-900'}>{title}</h3>
    {children}
  </div>
)

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ id, label }) => (
  <div className={'flex items-center gap-2'}>
    <Checkbox id={id} />
    <label
      htmlFor={id}
      className={'text-sm text-gray-700 cursor-pointer select-none'}
    >
      {label}
    </label>
  </div>
)

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

export const Filters: React.FC = () => {
  return (
    <aside
      className={
        'w-64 shrink-0 flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-4'
      }
    >
      <h2 className={'text-base font-semibold text-gray-900'}>{'Фільтри'}</h2>

      <FilterSection title={'Ціна (грн)'}>
        <div className={'flex items-center gap-2'}>
          <Input type={'number'} defaultValue={0} className={'rounded-sm'} />
          <Input
            type={'number'}
            defaultValue={50000}
            className={'rounded-sm'}
          />
        </div>
      </FilterSection>

      <FilterSection title={'Бренд'}>
        {brands.map((brand) => (
          <FilterCheckbox key={brand} id={`brand-${brand}`} label={brand} />
        ))}
      </FilterSection>

      <FilterSection title={"Оперативна пам'ять"}>
        {memory.map((m) => (
          <FilterCheckbox key={m} id={`memory-${m}`} label={m} />
        ))}
      </FilterSection>

      <FilterSection title={'Колір'}>
        {colors.map((color) => (
          <FilterCheckbox key={color} id={`color-${color}`} label={color} />
        ))}
      </FilterSection>

      <FilterSection title={'Рейтинг'}>
        {ratings.map((r) => (
          <FilterCheckbox
            key={r}
            id={`rating-${r}`}
            label={<Stars filled={r} />}
          />
        ))}
      </FilterSection>
    </aside>
  )
}
