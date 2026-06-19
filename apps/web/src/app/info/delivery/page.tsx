export default function DeliveryPage() {
  const methods = [
    {
      icon: '🚚',
      title: 'Кур\'єрська доставка',
      desc: 'Доставка у зручний для вас час. Кур\'єр зв\'яжеться з вами напередодні.',
      time: '1–3 дні',
    },
    {
      icon: '📦',
      title: 'Нова Пошта',
      desc: 'Отримайте замовлення у найближчому відділенні або поштоматі.',
      time: '1–2 дні',
    },
    {
      icon: '🏪',
      title: 'Самовивіз',
      desc: 'Заберіть замовлення самостійно з наших точок видачі безкоштовно.',
      time: 'Того ж дня',
    },
  ]

  const pricing = [
    { service: 'Кур\'єр по Чернівцях', cost: '79 грн', free: 'від 1 000 грн' },
    { service: 'Кур\'єр по регіону', cost: '149 грн', free: 'від 2 000 грн' },
    { service: 'Нова Пошта (відділення)', cost: 'За тарифами НП', free: 'від 1 500 грн' },
    { service: 'Нова Пошта (кур\'єр)', cost: 'За тарифами НП + 30 грн', free: 'від 2 000 грн' },
    { service: 'Укрпошта', cost: 'За тарифами УП', free: '—' },
    { service: 'Самовивіз', cost: 'Безкоштовно', free: '—' },
  ]

  const paymentMethods = [
    { icon: '💳', title: 'Карта онлайн', desc: 'Visa, Mastercard через захищений платіжний шлюз' },
    { icon: '💵', title: 'Готівка кур\'єру', desc: 'Оплата при отриманні готівкою' },
    { icon: '🏦', title: 'Накладений платіж', desc: 'Оплата при отриманні у відділенні пошти' },
    { icon: '📱', title: 'Оплата частинами', desc: 'ПриватБанк «Оплата частинами», Monobank «Покупка в кредит»' },
  ]

  const faq = [
    {
      q: 'Чи можна відстежити своє замовлення?',
      a: 'Так, після відправки ви отримаєте SMS/email з номером для відстеження. Ви також можете перевірити статус у особистому кабінеті.',
    },
    {
      q: 'У який час приїжджає кур\'єр?',
      a: 'Кур\'єр доставляє з 9:00 до 21:00. Точний час узгоджується телефоном напередодні доставки.',
    },
    {
      q: 'Де знаходяться пункти самовивозу?',
      a: 'Основна точка: м. Чернівці, вул. Рівненська, 16. Повний список пунктів доступний у кошику при оформленні замовлення.',
    },
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6 sm:gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-2xl sm:text-3xl font-bold text-gray-900'}>{'Доставка та оплата'}</h1>
        <p className={'mt-3 text-gray-500'}>{'Доставляємо по всій Україні. Оберіть зручний спосіб отримання та оплати.'}</p>
      </div>

      {/* Способи доставки */}
      <div className={'grid grid-cols-1 sm:grid-cols-3 gap-4'}>
        {methods.map(({ icon, title, desc, time }) => (
          <div key={title} className={'bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-2'}>
            <span className={'text-3xl'}>{icon}</span>
            <p className={'font-semibold text-gray-900'}>{title}</p>
            <p className={'text-sm text-gray-500 flex-1'}>{desc}</p>
            <p className={'text-xs font-semibold text-blue-600 mt-2'}>{'⏱ ' + time}</p>
          </div>
        ))}
      </div>

      {/* Вартість доставки */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Вартість доставки'}</h2>
        <div className={'overflow-x-auto'}>
          <table className={'w-full text-sm'}>
            <thead>
              <tr className={'text-left border-b border-gray-100'}>
                <th className={'pb-3 font-semibold text-gray-900 pr-4'}>{'Спосіб доставки'}</th>
                <th className={'pb-3 font-semibold text-gray-900 pr-4'}>{'Вартість'}</th>
                <th className={'pb-3 font-semibold text-gray-900'}>{'Безкоштовно від'}</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map(({ service, cost, free }) => (
                <tr key={service} className={'border-b border-gray-50'}>
                  <td className={'py-3 pr-4 text-gray-700'}>{service}</td>
                  <td className={'py-3 pr-4 text-gray-700'}>{cost}</td>
                  <td className={'py-3 text-gray-500'}>{free}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Способи оплати */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Способи оплати'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
          {paymentMethods.map(({ icon, title, desc }) => (
            <div key={title} className={'flex items-start gap-3 p-4 rounded-xl bg-gray-50'}>
              <span className={'text-2xl flex-shrink-0'}>{icon}</span>
              <div>
                <p className={'font-semibold text-gray-900 text-sm'}>{title}</p>
                <p className={'text-xs text-gray-500 mt-0.5'}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Часті запитання'}</h2>
        <div className={'flex flex-col gap-5'}>
          {faq.map(({ q, a }) => (
            <div key={q}>
              <p className={'font-semibold text-gray-900 text-sm'}>{q}</p>
              <p className={'mt-1 text-sm text-gray-500'}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
