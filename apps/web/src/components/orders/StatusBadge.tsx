export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'completed'
  | 'cancelled'

type StatusBadgeProps = {
  status: OrderStatus
}

const statusConfig = {
  pending: {
    label: 'Очікує',
    className: 'bg-yellow-100 text-yellow-800',
  },
  paid: {
    label: 'Оплачено',
    className: 'bg-blue-100 text-blue-800',
  },
  shipped: {
    label: 'Відправлено',
    className: 'bg-orange-100 text-orange-800',
  },
  completed: {
    label: 'Завершено',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Скасовано',
    className: 'bg-red-100 text-red-800',
  },
} satisfies Record<OrderStatus, { label: string; className: string }>

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]

  return (
    <span
      className={
        `rounded-full px-3 py-1 text-xs font-medium ${config.className}`
      }
    >
      {config.label}
    </span>
  )
}
