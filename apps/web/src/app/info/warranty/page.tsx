export default function WarrantyPage() {
  const warrantyTable = [
    { category: 'Велика побутова техніка', term: '24 місяці', type: 'Офіційна', service: 'Авторизований СЦ' },
    { category: 'Мала побутова техніка', term: '12 місяців', type: 'Офіційна', service: 'Авторизований СЦ' },
    { category: 'Меблі та декор', term: '12 місяців', type: 'Магазинна', service: 'NestHub' },
    { category: 'Текстиль', term: '6 місяців', type: 'Магазинна', service: 'NestHub' },
    { category: 'Освітлення', term: '12 місяців', type: 'Офіційна', service: 'Авторизований СЦ' },
    { category: 'Садовий інвентар', term: '6 місяців', type: 'Магазинна', service: 'NestHub' },
    { category: 'Електроніка та гаджети', term: '24 місяці', type: 'Офіційна', service: 'Авторизований СЦ' },
  ]

  const covered = [
    'Виробничі дефекти',
    'Несправності, що виникли у звичайних умовах експлуатації',
    'Дефекти матеріалів і збирання',
    'Відмова компонентів у межах гарантійного терміну',
  ]

  const notCovered = [
    'Механічні пошкодження (удари, падіння)',
    'Пошкодження рідиною',
    'Самостійний ремонт або модифікація',
    'Пошкодження внаслідок неправильної експлуатації',
    'Природний знос (батареї, фільтри, лампочки)',
    'Косметичні пошкодження (подряпини, вм\'ятини)',
  ]

  const steps = [
    {
      num: '1',
      title: 'Зверніться до нас',
      desc: 'Напишіть на warranty@nesthub.ua або зателефонуйте з описом проблеми та номером замовлення',
    },
    {
      num: '2',
      title: 'Діагностика',
      desc: 'Фахівець оцінить несправність. За необхідності товар надсилається до сервісного центру',
    },
    {
      num: '3',
      title: 'Ремонт або заміна',
      desc: 'Гарантійний ремонт, заміна товару або повернення коштів — залежно від ситуації',
    },
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6 sm:gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-2xl sm:text-3xl font-bold text-gray-900'}>{'Гарантія та сервіс'}</h1>
        <p className={'mt-3 text-gray-500 max-w-2xl mx-auto'}>
          {'Ми надаємо офіційну гарантію на всі товари та забезпечуємо якісний сервіс протягом усього гарантійного терміну.'}
        </p>
      </div>

      {/* Таблиця гарантій */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Гарантійні терміни за категоріями'}</h2>
        <div className={'overflow-x-auto'}>
          <table className={'w-full text-sm'}>
            <thead>
              <tr className={'text-left border-b border-gray-100'}>
                <th className={'pb-3 font-semibold text-gray-900 pr-4'}>{'Категорія'}</th>
                <th className={'pb-3 font-semibold text-gray-900 pr-4'}>{'Термін'}</th>
                <th className={'pb-3 font-semibold text-gray-900 pr-4'}>{'Тип'}</th>
                <th className={'pb-3 font-semibold text-gray-900'}>{'Сервіс'}</th>
              </tr>
            </thead>
            <tbody>
              {warrantyTable.map(({ category, term, type, service }) => (
                <tr key={category} className={'border-b border-gray-50'}>
                  <td className={'py-3 pr-4 text-gray-700 font-medium'}>{category}</td>
                  <td className={'py-3 pr-4 text-gray-700'}>{term}</td>
                  <td className={'py-3 pr-4'}>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${type === 'Офіційна' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {type}
                    </span>
                  </td>
                  <td className={'py-3 text-gray-500 text-xs'}>{service}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Що покривається / не покривається */}
      <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        <div className={'bg-white rounded-2xl border border-gray-200 p-6'}>
          <h3 className={'font-bold text-gray-900 mb-4'}>{'✓ Покривається гарантією'}</h3>
          <ul className={'flex flex-col gap-2'}>
            {covered.map((item) => (
              <li key={item} className={'flex items-start gap-2'}>
                <span className={'text-green-500 mt-0.5'}>{'✓'}</span>
                <span className={'text-sm text-gray-600'}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={'bg-white rounded-2xl border border-gray-200 p-6'}>
          <h3 className={'font-bold text-gray-900 mb-4'}>{'✕ Не покривається гарантією'}</h3>
          <ul className={'flex flex-col gap-2'}>
            {notCovered.map((item) => (
              <li key={item} className={'flex items-start gap-2'}>
                <span className={'text-red-400 mt-0.5'}>{'✕'}</span>
                <span className={'text-sm text-gray-600'}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Процес */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Як скористатися гарантією'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-3 gap-6'}>
          {steps.map(({ num, title, desc }) => (
            <div key={num} className={'flex flex-col gap-2'}>
              <div className={'w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold'}>
                {num}
              </div>
              <p className={'font-semibold text-gray-900 text-sm'}>{title}</p>
              <p className={'text-xs text-gray-500'}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Контакти */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Гарантійний відділ'}</h2>
        <p className={'text-sm text-gray-600'}>{'Email: '}<span className={'text-blue-600'}>{'warranty@nesthub.ua'}</span></p>
        <p className={'text-sm text-gray-600 mt-1'}>{'Телефон: +38 (096) 743-82-38'}</p>
        <p className={'text-xs text-gray-400 mt-1'}>{'Пн–Пт: 9:00–18:00'}</p>
      </div>
    </div>
  )
}
