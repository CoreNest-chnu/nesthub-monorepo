import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Button } from '@/src/components/ui/button'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label={'pagination'}
      data-slot={'pagination'}
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot={'pagination-content'}
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot={'pagination-item'} {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant={isActive ? 'outline' : 'ghost'}
      size={size}
      className={cn(className)}
    >
      {React.createElement('a', {
        'aria-current': isActive ? 'page' : undefined,
        'data-slot': 'pagination-link',
        'data-active': isActive,
        ...props,
      })}
    </Button>
  )
}

function PaginationPrevious({
  className,
  text = 'Previous',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label={'Go to previous page'}
      size={'default'}
      className={cn('pl-2!', className)}
      {...props}
    >
      <ChevronLeftIcon data-icon={'inline-start'} />
      <span className={'hidden sm:block'}>{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = 'Next',
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label={'Go to next page'}
      size={'default'}
      className={cn('pr-2!', className)}
      {...props}
    >
      <span className={'hidden sm:block'}>{text}</span>
      <ChevronRightIcon data-icon={'inline-end'} />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot={'pagination-ellipsis'}
      className={cn(
        "flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className={'sr-only'}>{'More pages'}</span>
    </span>
  )
}

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

const buildPageItems = (current: number, total: number): PageItem[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) items.push('ellipsis-left')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('ellipsis-right')

  items.push(total)
  return items
}

type PaginationControlsProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  prevText?: string
  nextText?: string
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className,
  prevText = 'Previous',
  nextText = 'Next',
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const items = buildPageItems(page, totalPages)
  const prevDisabled = page === 1
  const nextDisabled = page === totalPages

  const handle =
    (target: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (target < 1 || target > totalPages || target === page) return
      onPageChange(target)
    }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            text={prevText}
            href={'#'}
            aria-disabled={prevDisabled}
            className={prevDisabled ? 'pointer-events-none opacity-40' : ''}
            onClick={handle(page - 1)}
          />
        </PaginationItem>

<<<<<<< HEAD
        {items.map((item, idx) =>
          item === 'ellipsis' ? (
            <PaginationItem
              key={`ellipsis-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                idx
              }-${page}`}
            >
=======
        {items.map((item) =>
          item === 'ellipsis-left' || item === 'ellipsis-right' ? (
            <PaginationItem key={item}>
>>>>>>> 6079ae6 (fix: product tests and lint issues)
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={'#'}
                isActive={item === page}
                onClick={handle(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            text={nextText}
            href={'#'}
            aria-disabled={nextDisabled}
            className={nextDisabled ? 'pointer-events-none opacity-40' : ''}
            onClick={handle(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationControls,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}