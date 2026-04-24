const columns = [
  {
    title: 'Про нас',
    links: ['Про компанію', 'Контакти', "Кар'єра"],
  },
  {
    title: 'Покупцям',
    links: ['Доставка та оплата', 'Повернення товару', 'Гарантія'],
  },
  {
    title: 'Партнерам',
    links: ['Співпраця', 'Оптові закупівлі'],
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
              {links.map((link) => (
                <li key={link}>
                  <a
                    href={'#'}
                    className={'text-sm text-gray-500 hover:text-gray-800'}
                  >
                    {link}
                  </a>
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
            <li className={'text-sm text-gray-500'}>{'+38 (099) 123-45-67'}</li>
            <li className={'text-sm text-gray-500'}>{'info@nesthub.ua'}</li>
            <li className={'text-sm text-gray-500'}>{'Чернівці, вул. Рівненська, 16'}</li>
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
