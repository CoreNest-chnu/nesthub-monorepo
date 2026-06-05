'use client'

import { MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'

export default function ReviewsPage() {
  return (
    <div className={'flex flex-col gap-6'}>
      <div>
        <h2 className={'text-xl font-semibold text-gray-900'}>
          {'Мої відгуки'}
        </h2>
        <p className={'mt-1 text-sm text-gray-500'}>
          {'Тут зʼявляться відгуки, які ви залишили про куплені товари'}
        </p>
      </div>

      <div
        className={
          'flex flex-col items-center justify-center gap-4 py-16 text-center'
        }
      >
        <div
          className={
            'flex size-16 items-center justify-center rounded-full bg-amber-50'
          }
        >
          <MessageSquare
            size={28}
            className={'text-amber-400'}
            strokeWidth={1.5}
          />
        </div>

        <div className={'flex flex-col items-center gap-2'}>
          <p className={'text-base font-semibold text-gray-900'}>
            {'Ви ще не залишили жодного відгуку'}
          </p>
          <div className={'flex items-center gap-1 text-gray-300'}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={18} />
            ))}
          </div>
          <p className={'max-w-sm text-sm text-gray-500'}>
            {
              'Купуйте товари та діліться враженнями — ваші оцінки допоможуть іншим покупцям зробити вибір.'
            }
          </p>
        </div>

        <Link
          href={'/catalog'}
          className={
            'mt-2 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800'
          }
        >
          {'Перейти до каталогу'}
        </Link>
      </div>
    </div>
  )
}
