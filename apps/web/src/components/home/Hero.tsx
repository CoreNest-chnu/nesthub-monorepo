import Link from 'next/link'
import { Container } from '@/src/components/Container'

export const Hero: React.FC = () => {
  return (
    <section
      className={
        'relative bg-gradient-to-br from-blue-600 via-indigo-500 to-fuchsia-500'
      }
    >
      <Container>
        <div
          className={
            'flex flex-col items-center justify-center text-center py-24 md:py-32 gap-6'
          }
        >
          <h1 className={'text-3xl md:text-5xl font-bold text-white'}>
            {'Нова колекція'}
          </h1>
          <p className={'text-base md:text-lg text-white/90'}>
            {'Смартфони 2026 року'}
          </p>
          <Link
            href={'/catalog'}
            className={
              'inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900 transition-colors'
            }
          >
            {'Дивитись новинки'}
          </Link>
        </div>
      </Container>
    </section>
  )
}
