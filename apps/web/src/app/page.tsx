import { Hero } from '@/src/components/home/Hero'
import { PopularProducts } from '@/src/components/home/PopularProducts'
import { Promos } from '@/src/components/home/Promos'

export default function Home() {
  return (
    <div className={'min-h-screen bg-gray-50'}>
      <Hero />
      <Promos />
      <PopularProducts />
    </div>
  )
}
