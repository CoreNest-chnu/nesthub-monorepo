import { Container } from '@/src/components/container'
import { Catalog } from '@/src/components/products/Catalog'

export default function ProductsPage() {
  return (
    <div className={'min-h-screen bg-gray-50 py-8'}>
      <Container>
        <Catalog />
      </Container>
    </div>
  )
}
