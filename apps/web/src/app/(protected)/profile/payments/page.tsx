'use client'

import {
  getPaymentControllerCardsQueryKey,
  type SavedCardModel,
  usePaymentControllerCards,
  usePaymentControllerDeleteCard,
} from '@repo/api-client'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'
import { toast } from 'sonner'

type SavedCardRowProps = {
  card: SavedCardModel
  accessToken: string | undefined
  onDeleted: () => void
}

const SavedCardRow: React.FC<SavedCardRowProps> = ({
  card,
  accessToken,
  onDeleted,
}) => {
  const { mutateAsync: deleteCard, isPending } = usePaymentControllerDeleteCard(
    {
      request: { headers: { Authorization: `Bearer ${accessToken}` } },
    },
  )

  const handleDelete = useCallback(async () => {
    try {
      await deleteCard({ id: card.id })
      onDeleted()
      toast.success('Картку видалено')
    } catch {
      toast.error('Не вдалося видалити картку')
    }
  }, [card.id, deleteCard, onDeleted])

  return (
    <div
      className={
        'flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5'
      }
    >
      <div className={'flex flex-col gap-1'}>
        <div className={'flex items-center gap-3'}>
          <span className={'text-sm font-semibold text-gray-900 uppercase'}>
            {card.brand}
          </span>
          <span className={'text-sm text-gray-700'}>
            {`•••• ${card.last4}`}
          </span>
        </div>
        <p className={'text-xs text-gray-500'}>
          {`${card.cardholderName} · ${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`}
        </p>
      </div>

      <button
        type={'button'}
        onClick={handleDelete}
        disabled={isPending}
        aria-label={'Видалити картку'}
        className={
          'text-gray-300 hover:text-red-400 cursor-pointer bg-transparent border-none p-1 disabled:opacity-40 disabled:cursor-not-allowed'
        }
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}

export default function PaymentsPage() {
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const queryClient = useQueryClient()

  const authHeaders: Record<string, string> = {}

  if (accessToken) {
    authHeaders.Authorization = `Bearer ${accessToken}`
  }

  const { data, isLoading } = usePaymentControllerCards({
    query: { enabled: status === 'authenticated' },
    request: { headers: authHeaders },
  })

  const handleDeleted = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: getPaymentControllerCardsQueryKey(),
    })
  }, [queryClient])

  const cards = data?.data ?? []

  if (isLoading) {
    return <p className={'text-sm text-gray-500'}>{'Завантаження…'}</p>
  }

  if (cards.length === 0) {
    return (
      <div
        className={
          'rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center'
        }
      >
        <h2 className={'text-lg font-semibold text-black'}>
          {'Збережених карток немає'}
        </h2>
        <p className={'mt-2 text-sm text-gray-500'}>
          {'При оплаті відмітьте «Зберегти картку», щоб вона з’явилася тут.'}
        </p>
      </div>
    )
  }

  return (
    <main className={'mx-auto flex max-w-3xl flex-col gap-4'}>
      <h1 className={'mb-2 text-2xl font-bold text-black sm:text-3xl'}>
        {'Способи оплати'}
      </h1>

      <div className={'flex flex-col gap-3'}>
        {cards.map((card) => (
          <SavedCardRow
            key={card.id}
            card={card}
            accessToken={accessToken}
            onDeleted={handleDeleted}
          />
        ))}
      </div>
    </main>
  )
}
