'use client'

import { type OrderModel, useOrderControllerAllOrders } from '@repo/api-client'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import { useCallback } from 'react'
import { OrderRow } from '@/src/components/admin/OrderRow'
import { PaginationControls } from '@/src/components/ui/pagination'

const take = 10

const columnHelper = createColumnHelper<OrderModel>()

const columns = [
  columnHelper.accessor('id', { header: 'ID замовлення' }),
  columnHelper.accessor('userId', { header: 'ID користувача' }),
  columnHelper.accessor('status', { header: 'Статус' }),
  columnHelper.accessor('totalAmount', { header: 'Сума' }),
  columnHelper.display({ id: 'items', header: 'Товарів' }),
  columnHelper.accessor('createdAt', { header: 'Дата' }),
]

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()

  const { data, isLoading } = useOrderControllerAllOrders({
    query: { enabled: status === 'authenticated' },
    request: {
      headers: session?.accessToken
        ? { Authorization: `Bearer ${session.accessToken}` }
        : {},
    },
  })

  const allOrders = data?.data ?? []

  const table = useReactTable({
    data: allOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: take, pageIndex: 0 },
    },
  })

  const handlePageChange = useCallback(
    (p: number) => { table.setPageIndex(p - 1) },
    [table],
  )

  if (isLoading) {
    return (
      <div className={'flex flex-col gap-4'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>{'Замовлення'}</h2>
        <div className={'bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Завантаження…'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center justify-between'}>
        <h2 className={'text-lg font-semibold text-gray-900'}>{'Замовлення'}</h2>
        <span className={'text-sm text-gray-500'}>{`Всього: ${allOrders.length}`}</span>
      </div>

      <div className={'bg-white rounded-2xl border border-gray-200 overflow-hidden'}>
        {allOrders.length === 0 ? (
          <div className={'p-8 text-center text-sm text-gray-500'}>{'Замовлень немає'}</div>
        ) : (
          <table className={'w-full'}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={'bg-gray-50 text-left'}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={
                        'px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <OrderRow key={row.id} order={row.original} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {table.getPageCount() > 1 && (
        <PaginationControls
          page={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={handlePageChange}
          prevText={'Назад'}
          nextText={'Вперед'}
        />
      )}
    </div>
  )
}
