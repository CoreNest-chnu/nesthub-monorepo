'use client'

import { useProductControllerProducts } from '@repo/api-client'
import Link from 'next/link'
import { Container } from '@/src/components/Container'
import { ProductCard } from '@/src/components/products/ProductCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/src/components/ui/carousel'

const POPULAR_TAKE = 6

const PopularSkeleton: React.FC = () => (
  <div
    className={
      'flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden'
    }
  >
    <div className={'aspect-square bg-gray-200 animate-pulse'} />
    <div className={'flex flex-col gap-2 p-3'}>
      <div className={'h-4 w-3/4 bg-gray-200 rounded animate-pulse'} />
      <div className={'h-4 w-1/2 bg-gray-200 rounded animate-pulse'} />
      <div className={'h-8 w-full bg-gray-200 rounded animate-pulse mt-1'} />
    </div>
  </div>
)

const skeletonKeys = Array.from({ length: POPULAR_TAKE }, () =>
  crypto.randomUUID(),
)

const itemClassName =
  'pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'

export const PopularProducts: React.FC = () => {
  const { data, isLoading } = useProductControllerProducts({
    page: 1,
    take: POPULAR_TAKE,
  })

  const products = data?.data.products ?? []

  return (
    <section className={'py-8'}>
      <Container>
        <div className={'flex items-center justify-between mb-6'}>
          <h2 className={'text-xl font-semibold text-gray-900'}>
            {'Популярні товари'}
          </h2>
          <Link
            href={'/catalog'}
            className={'text-sm font-medium text-blue-600 hover:underline'}
          >
            {'Дивитись всі →'}
          </Link>
        </div>

        <Carousel opts={{ align: 'start', loop: true }} className={'w-full'}>
          <CarouselContent className={'-ml-4'}>
            {isLoading
              ? skeletonKeys.map((key) => (
                  <CarouselItem key={key} className={itemClassName}>
                    <PopularSkeleton />
                  </CarouselItem>
                ))
              : products.map((product) => (
                  <CarouselItem key={product.id} className={itemClassName}>
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
    </section>
  )
}
