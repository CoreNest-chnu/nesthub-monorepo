'use client'

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useCallback, useMemo, useRef, useState } from 'react'
import { cn } from '@/src/lib/utils'
import {
  type CellClassFn,
  type CustomColumn,
  getCommonClass,
  isSticky,
  TableRow,
} from './TableRow'

export type { CellClassFn, CustomColumn }

export const dragColumnId = '__dragHandle__'

export type TableProps<D extends object> = {
  columns: Array<CustomColumn<D>>
  data: D[]
  onRowClick?: (row: Row<D>) => void
  href?: (row: Row<D>) => void
  hideOverflow?: boolean
  borderless?: boolean
  compact?: boolean
  hideHeader?: boolean
  draggable?: boolean
  getRowId?: (item: D) => string
  getRowCanExpand?: (row: Row<D>) => boolean
  renderExpandedContent?: (row: Row<D>) => React.ReactNode
  bodyClassName?: string
  headerClassName?: string
}

const hasFooterColumnsOrData = <T extends object>(
  columns: CustomColumn<T>[],
): boolean => {
  return columns.some(
    (column) =>
      column.footer != null ||
      column.columns?.some((col) => col.footer != null),
  )
}

const getHeaderClass = (column: object) =>
  'headerClass' in column && typeof column.headerClass === 'string'
    ? column.headerClass
    : ''

const getCellClass = (column: object) =>
  'cellClass' in column && typeof column.cellClass === 'string'
    ? column.cellClass
    : ''

const getFooterClass = (column: object) =>
  'footerClass' in column && typeof column.footerClass === 'string'
    ? column.footerClass
    : ''

export const Table = <D extends object>({
  columns: inputColumns,
  data,
  href,
  onRowClick,
  hideOverflow,
  borderless,
  compact,
  hideHeader,
  draggable,
  getRowId,
  getRowCanExpand,
  renderExpandedContent,
  bodyClassName,
  headerClassName,
}: TableProps<D>) => {
  const [offsetWidth, setOffsetWidth] = useState(0)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const handleSetOffsetWidth = useCallback((ref: HTMLTableElement | null) => {
    setOffsetWidth(ref?.offsetWidth ?? 0)
  }, [])

  const columns = useMemo(() => {
    const visibleColumns = inputColumns.filter(
      ({ isHidden = false }) => !isHidden,
    )

    if (draggable) {
      const dragHandleColumn: CustomColumn<D> = {
        id: dragColumnId,
        header: '',
        size: 40,
      }

      return [dragHandleColumn, ...visibleColumns]
    }

    return visibleColumns
  }, [inputColumns, draggable])

  const { getHeaderGroups, getRowModel, getFooterGroups } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: {
      columnVisibility,
    },
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    getExpandedRowModel: getExpandedRowModel(),
  })

  const hasFooterColumns = hasFooterColumnsOrData(columns)

  const handleOnScrollTopScrollbar = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!scrollbarRef.current) {
        return
      }

      scrollbarRef.current.scrollLeft = e.currentTarget.scrollLeft
    },
    [],
  )

  const handleOnScrollTable = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (!tableWrapperRef.current) {
        return
      }

      tableWrapperRef.current.scrollLeft = e.currentTarget.scrollLeft
    },
    [],
  )

  return (
    <div className={'rounded-md relative'}>
      <div
        className={cn('h-4 overflow-y-hidden', {
          'absolute top-0 right-0 left-0 z-20': hideOverflow,
          hidden: !hideOverflow || compact,
        })}
        ref={scrollbarRef}
        onScroll={handleOnScrollTable}
      >
        <div style={{ width: `${offsetWidth}px` }} />
      </div>
      <div
        className={cn(
          'bg-white flex-1 flex flex-col overflow-y-auto border-gray-200',
          { 'border-t': !borderless, 'rounded-md': compact },
        )}
        ref={tableWrapperRef}
        onScroll={handleOnScrollTopScrollbar}
      >
        <table
          className={'min-w-full overflow-y-auto'}
          ref={handleSetOffsetWidth}
        >
          {!hideHeader && (
            <thead
              className={cn('sticky top-0 z-10 bg-gray-50', headerClassName)}
            >
              {getHeaderGroups().map((headerGroup) => {
                return (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(
                      ({
                        column,
                        id,
                        colSpan,
                        getContext,
                        isPlaceholder,
                        getSize,
                      }) => {
                        const { columnDef } = column
                        const headerClass = getHeaderClass(columnDef)
                        const commonClass = getCommonClass(columnDef)
                        const sticky = isSticky(columnDef)

                        return (
                          <th
                            key={id}
                            colSpan={colSpan}
                            style={draggable ? { width: getSize() } : undefined}
                            className={cn(
                              'px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide',
                              commonClass,
                              headerClass,
                              sticky && 'bg-gray-50',
                              { 'sticky z-10': sticky },
                            )}
                          >
                            {isPlaceholder
                              ? null
                              : flexRender(
                                  column.columnDef.header,
                                  getContext(),
                                )}
                          </th>
                        )
                      },
                    )}
                  </tr>
                )
              })}
            </thead>
          )}
          <tbody className={bodyClassName}>
            {getRowModel().rows.map((row) => (
              <TableRow
                onClick={href ?? onRowClick}
                row={row}
                key={row.id}
                borderless
                draggable={draggable}
                rowId={getRowId?.(row.original)}
                dragColumnId={dragColumnId}
                renderExpandedContent={renderExpandedContent}
              />
            ))}
          </tbody>
          {hasFooterColumns && (
            <tfoot>
              {getFooterGroups().map((footerGroup, idx, arr) => {
                if (
                  footerGroup.headers.some(
                    ({ isPlaceholder }) => isPlaceholder,
                  ) ||
                  (arr.length > 1 && idx > 0)
                ) {
                  return null
                }

                return (
                  <tr
                    key={footerGroup.id}
                    className={cn('bg-gray-50 border-gray-100', {
                      'border-t': !borderless,
                    })}
                  >
                    {footerGroup.headers.map(({ column, id, getContext }) => {
                      const { columnDef } = column
                      const cellClass = getCellClass(columnDef)
                      const footerClass = getFooterClass(columnDef) || cellClass
                      const commonClass = getCommonClass(columnDef)
                      const sticky = isSticky(columnDef)

                      return (
                        <th
                          key={id}
                          className={cn(
                            'p-4 bg-white sticky bottom-0 font-medium text-gray-900 text-sm',
                            commonClass,
                            footerClass,
                            { 'z-10 bg-white': sticky },
                          )}
                        >
                          {flexRender(column.columnDef.footer, getContext())}
                        </th>
                      )
                    })}
                  </tr>
                )
              })}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
