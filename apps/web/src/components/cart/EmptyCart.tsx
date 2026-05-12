'use client'

import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export const EmptyCart: React.FC = () => (
  <div
    className={
      'flex flex-col items-center justify-center gap-4 py-20 text-center'
    }
  >
    <ShoppingCart size={48} className={'text-gray-300'} />
    <p className={'text-lg font-medium text-gray-700'}>{'Ваш кошик порожній'}</p>
    <Link
      href={'/catalog'}
      className={
        'px-6 h-11 inline-flex items-center rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors'
      }
    >
      {'Перейти до каталогу'}
    </Link>
  </div>
)
