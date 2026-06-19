import { Container } from '@/src/components/Container'
import { Catalog } from '@/src/components/products/Catalog'
import { Filters } from '@/src/components/products/Filters'

export default function ProductsPage() {
  return (
    <div className={'min-h-screen bg-gray-50 py-6 sm:py-8'}>
      <Container>
        <div className={'flex flex-col gap-6 lg:flex-row'}>
          <Filters />
          <Catalog />
        </div>
      </Container>
    </div>
  )
}
