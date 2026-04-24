import { Container } from '@/src/components/Container'

const promos = [
  {
    title: 'Промо 1',
    description: 'Знижки до 50% на смартфони',
  },
  {
    title: 'Промо 2',
    description: 'Безкоштовна доставка',
  },
  {
    title: 'Промо 3',
    description: 'Розстрочка 0%',
  },
]

export const Promos: React.FC = () => {
  return (
    <section className={'py-8'}>
      <Container>
        <div className={'grid grid-cols-1 gap-4 md:grid-cols-3'}>
          {promos.map(({ title, description }) => (
            <div
              key={title}
              className={
                'flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-6'
              }
            >
              <h3 className={'text-base font-semibold text-gray-900'}>
                {title}
              </h3>
              <p className={'text-sm text-gray-500'}>{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
