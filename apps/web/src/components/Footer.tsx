import Link from 'next/link'

const columns = [
  {
    title: 'Про нас',
    links: [
      { label: 'Про компанію', href: '/info/about' },
      { label: 'Контакти', href: '/info/contacts' },
      { label: "Кар'єра", href: '/info/career' },
    ],
  },
  {
    title: 'Покупцям',
    links: [
      { label: 'Доставка та оплата', href: '/info/delivery' },
      { label: 'Повернення товару', href: '/info/return' },
      { label: 'Гарантія', href: '/info/warranty' },
    ],
  },
  {
    title: 'Партнерам',
    links: [
      { label: 'Співпраця', href: '/info/partnership' },
      { label: 'Оптові закупівлі', href: '/info/wholesale' },
    ],
  },
]

export const Footer: React.FC = () => (
  <footer className={'bg-gray-100 border-t border-gray-200'}>
    <div className={'max-w-[1200px] mx-auto px-6 py-10'}>
      <div className={'grid grid-cols-4 gap-8'}>
        {columns.map(({ title, links }) => (
          <div key={title}>
            <h4 className={'text-sm font-semibold text-gray-900 mb-3'}>
              {title}
            </h4>
            <ul className={'flex flex-col gap-2'}>
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className={'text-sm text-gray-500 hover:text-gray-800'}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className={'text-sm font-semibold text-gray-900 mb-3'}>
            {'Контакти'}
          </h4>
          <ul className={'flex flex-col gap-2'}>
            <li className={'text-sm text-gray-500'}>{'+38 (096) 743-82-33'}</li>
            <li className={'text-sm text-gray-500'}>{'info@nesthub.ua'}</li>
            <li className={'text-sm text-gray-500'}>
              {'Чернівці, вул. Рівненська, 16'}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className={'border-t border-gray-200 py-4 text-center'}>
      <p className={'text-xs text-gray-400'}>
        {'© 2026 NestHub. Усі права захищені.'}
      </p>
    </div>
  </footer>
)
