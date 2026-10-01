import { Suspense } from 'react'
import { Container } from '@/src/components/Container'
import { Catalog } from '@/src/components/products/Catalog'
import { Filters } from '@/src/components/products/Filters'

export default function ProductsPage() {
  return (
    <div className={'min-h-screen bg-gray-50 py-8'}>
      <Container>
        {/* Filters and Catalog read query params, which needs a Suspense boundary for `next build`. */}
        <Suspense>
          <div className={'flex gap-6'}>
            <Filters />
            <Catalog />
          </div>
        </Suspense>
      </Container>
    </div>
  )
}
