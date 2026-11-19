import { Suspense } from 'react'
import { Container } from '@/src/components/Container'
import { Catalog } from '@/src/components/products/Catalog'
import { Filters } from '@/src/components/products/Filters'

export default function ProductsPage() {
  return (
    <div className={'min-h-screen bg-gray-50 py-8'}>
      <Container>
        <div className={'flex gap-6'}>
          <Suspense fallback={null}>
            <Filters />
            <Catalog />
          </Suspense>
        </div>
      </Container>
    </div>
  )
}
