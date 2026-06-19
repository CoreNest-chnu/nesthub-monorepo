import Link from 'next/link'
import { Construction } from 'lucide-react'
import { Container } from './Container'

type ComingSoonProps = {
  title: string
  description?: string
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description = 'Ця сторінка в розробці. Слідкуйте за оновленнями.',
}) => {
  return (
    <Container>
      <div
        className={
          'flex flex-col items-center justify-center text-center gap-4 px-4 py-12 sm:py-24'
        }
      >
        <div
          className={
            'flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600'
          }
        >
          <Construction size={32} />
        </div>
        <h1 className={'text-2xl font-semibold text-gray-900'}>{title}</h1>
        <p className={'text-sm text-gray-500 max-w-md'}>{description}</p>
        <Link
          href={'/'}
          className={
            'mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900 transition-colors'
          }
        >
          {'На головну'}
        </Link>
      </div>
    </Container>
  )
}
