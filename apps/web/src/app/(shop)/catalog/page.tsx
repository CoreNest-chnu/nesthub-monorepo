import { Container } from '@/src/components/Container'
import { Catalog } from '@/src/components/products/Catalog'

export default function CatalogPage() {
  return (
    <div className={'min-h-screen bg-gray-50 py-8'}>
      <Container>
        <Catalog />
      </Container>
    </div>
  )
}
