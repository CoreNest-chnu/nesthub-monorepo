import { type OrderModel, OrderModelStatus } from '@repo/api-client'

type Props = {
  order: OrderModel
}

const statusLabel: Record<string, string> = {
  [OrderModelStatus.pending]: 'Очікує',
  [OrderModelStatus.paid]: 'Оплачено',
  [OrderModelStatus.shipped]: 'Відправлено',
  [OrderModelStatus.completed]: 'Виконано',
  [OrderModelStatus.cancelled]: 'Скасовано',
}

const statusColor: Record<string, string> = {
  [OrderModelStatus.pending]: 'bg-yellow-100 text-yellow-700',
  [OrderModelStatus.paid]: 'bg-blue-100 text-blue-700',
  [OrderModelStatus.shipped]: 'bg-purple-100 text-purple-700',
  [OrderModelStatus.completed]: 'bg-green-100 text-green-700',
  [OrderModelStatus.cancelled]: 'bg-red-100 text-red-600',
}

export const OrderRow: React.FC<Props> = ({ order }) => {
  const color = statusColor[order.status] ?? 'bg-gray-100 text-gray-600'
  const label = statusLabel[order.status] ?? order.status

  return (
    <tr className={'border-t border-gray-100 hover:bg-gray-50 transition-colors'}>
      <td className={'px-4 py-3 text-sm text-gray-500 font-mono'}>
        {`${order.id.slice(0, 8)}…`}
      </td>
      <td className={'px-4 py-3 text-sm text-gray-700 font-mono'}>
        {`${order.userId.slice(0, 8)}…`}
      </td>
      <td className={'px-4 py-3'}>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
        >
          {label}
        </span>
      </td>
      <td className={'px-4 py-3 text-sm font-medium text-gray-900'}>
        {`₴${Number(order.totalAmount).toFixed(2)}`}
      </td>
      <td className={'px-4 py-3 text-sm text-gray-500 text-center'}>
        {order.Items.length}
      </td>
      <td className={'px-4 py-3 text-sm text-gray-500'}>
        {new Date(order.createdAt).toLocaleDateString('uk-UA')}
      </td>
    </tr>
  )
}
