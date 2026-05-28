'use client'

import type { DraggableSyntheticListeners } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { ColumnDef, flexRender, Row } from '@tanstack/react-table'
import { GripVertical } from 'lucide-react'
import { CSSProperties, useCallback } from 'react'
import { cn } from '@/src/lib/utils'

export type CellClassFn<D extends object> = (row: Row<D>) => string

export type CustomColumn<D extends object> = ColumnDef<D> & {
  columns?: CustomColumn<D>[]
  commonClass?: string
  headerClass?: string
  cellClass?: string | CellClassFn<D>
  footerClass?: string
  contentPosition?: 'left' | 'center' | 'right'
  sticky?: boolean
  isHidden?: boolean
}

export type TableRowProps<D extends object> = {
  row: Row<D>
  onClick?: (row: Row<D>) => void
  borderless?: boolean
  draggable?: boolean
  rowId?: string
  dragColumnId?: string
  renderExpandedContent?: (row: Row<D>) => React.ReactNode
}

type DragHandleProps = {
  isDragging: boolean
  attributes: ReturnType<typeof useSortable>['attributes']
  listeners: DraggableSyntheticListeners
}

type RowContentProps<D extends object> = TableRowProps<D> & {
  isDragging?: boolean
  dragHandleProps?: DragHandleProps
  style?: CSSProperties
  nodeRef?: (node: HTMLElement | null) => void
}

type DraggableRowProps<D extends object> = Omit<TableRowProps<D>, 'draggable'> & {
  rowId: string
}

const hasCellClass = <D extends object>(
  column: object,
): column is { cellClass: CellClassFn<D> | string } => 'cellClass' in column

export const getCommonClass = (column: object) => {
  const commonClass =
    'commonClass' in column && typeof column.commonClass === 'string'
      ? column.commonClass
      : ''

  const contentPosition =
    'contentPosition' in column &&
    (column.contentPosition === 'left' ||
      column.contentPosition === 'center' ||
      column.contentPosition === 'right')
      ? column.contentPosition
      : 'center'

  return cn(commonClass, `text-${contentPosition}`)
}

export const isSticky = (column: object) =>
  'sticky' in column && column.sticky === true

export const getCellClassFromDef = <D extends object>(
  columnDef: object,
  row: Row<D>,
): string => {
  if (!hasCellClass<D>(columnDef)) {
    return ''
  }

  const { cellClass } = columnDef

  if (typeof cellClass === 'function') {
    return cellClass(row)
  }

  return cellClass
}

const isDragHandleColumn = (columnDef: object, dragColumnId?: string) =>
  !!dragColumnId && 'id' in columnDef && columnDef.id === dragColumnId

const stopPropagation = (e: React.MouseEvent) => { e.stopPropagation() }

const RowContent = <D extends object>({
  row,
  onClick,
  borderless,
  draggable,
  dragColumnId,
  isDragging,
  dragHandleProps,
  style,
  nodeRef,
  renderExpandedContent,
}: RowContentProps<D>) => {
  const handleRowClick = useCallback(() => {
    onClick?.(row)
  }, [onClick, row])

  return (
    <>
      <tr
        ref={nodeRef}
        style={style}
        className={cn(
          'group border-gray-100',
          { 'border-b border-t': !borderless },
          { 'cursor-pointer': onClick },
          isDragging && 'opacity-50 bg-blue-50',
        )}
        onClick={onClick ? handleRowClick : undefined}
      >
        {row.getVisibleCells().map((cell) => {
          const { columnDef } = cell.column

          const cellClass = getCellClassFromDef(columnDef, row)
          const commonClass = getCommonClass(columnDef)
          const sticky = isSticky(columnDef)

          if (
            draggable &&
            isDragHandleColumn(columnDef, dragColumnId) &&
            dragHandleProps
          ) {
            return (
              <td
                key={cell.id}
                className={cn(
                  'px-4 py-3 group-hover:bg-gray-50 align-middle text-sm text-gray-900 w-10 min-w-10',
                  commonClass,
                  cellClass,
                  { sticky },
                  sticky && 'bg-white',
                )}
              >
                <button
                  type={'button'}
                  className={cn(
                    'cursor-grab rounded p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                    dragHandleProps.isDragging && 'cursor-grabbing',
                  )}
                  aria-label={'Drag to reorder'}
                  onClick={stopPropagation}
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                >
                  <GripVertical className={'h-4 w-4 text-gray-400'} />
                </button>
              </td>
            )
          }

          return (
            <td
              key={cell.id}
              className={cn(
                'px-4 py-3 group-hover:bg-gray-50 align-middle text-sm text-gray-900 w-auto',
                commonClass,
                cellClass,
                { sticky },
                sticky && 'bg-white',
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          )
        })}
      </tr>

      {row.getCanExpand() && row.getIsExpanded() && renderExpandedContent && (
        <tr
          key={`${row.id}-${row.parentId}`}
          className={cn('border-gray-200 border-y', {
            'cursor-pointer': onClick,
          })}
        >
          <td
            key={row.id}
            colSpan={row.getVisibleCells().length}
            className={cn('p-2 align-middle text-sm text-gray-900 w-auto')}
          >
            {renderExpandedContent(row)}
          </td>
        </tr>
      )}
    </>
  )
}

const DraggableRow = <D extends object>({
  row,
  onClick,
  borderless,
  rowId,
  dragColumnId,
  renderExpandedContent,
}: DraggableRowProps<D>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rowId })

  const style: CSSProperties = {
    transform: transform ? `translateY(${transform.y}px)` : undefined,
    transition,
    zIndex: isDragging ? 1000 : 'auto',
  }

  return (
    <RowContent
      row={row}
      onClick={onClick}
      borderless={borderless}
      draggable
      dragColumnId={dragColumnId}
      isDragging={isDragging}
      dragHandleProps={{ isDragging, attributes, listeners }}
      style={style}
      nodeRef={setNodeRef}
      renderExpandedContent={renderExpandedContent}
    />
  )
}

export const TableRow = <D extends object>({
  row,
  onClick,
  borderless,
  draggable,
  rowId,
  dragColumnId,
  renderExpandedContent,
}: TableRowProps<D>) => {
  if (draggable && rowId) {
    return (
      <DraggableRow
        row={row}
        onClick={onClick}
        borderless={borderless}
        rowId={rowId}
        dragColumnId={dragColumnId}
        renderExpandedContent={renderExpandedContent}
      />
    )
  }

  return (
    <RowContent
      row={row}
      onClick={onClick}
      borderless={borderless}
      renderExpandedContent={renderExpandedContent}
    />
  )
}
