export default function WholesalePage() {
  const benefits = [
    { icon: '💰', title: 'Знижки від 5%', desc: 'Прогресивна система знижок залежно від обсягу замовлення' },
    { icon: '📦', title: 'Пріоритетна відвантаження', desc: 'Ваші замовлення обробляються в першу чергу' },
    { icon: '🤝', title: 'Персональний менеджер', desc: 'Виділений менеджер для супроводу вашого бізнесу' },
    { icon: '📊', title: 'Детальна звітність', desc: 'Повна аналітика замовлень та продажів у кабінеті' },
    { icon: '💳', title: 'Відстрочка платежу', desc: 'Можливість оплати з відстрочкою до 30 днів (від Стандарт)' },
    { icon: '🚚', title: 'Безкоштовна доставка', desc: 'Від певного обсягу замовлення доставка безкоштовна' },
  ]

  const tiers = [
    { name: 'Початковий', min: '50 000 грн', discount: '5%', color: 'border-gray-200', badge: 'bg-gray-100 text-gray-700' },
    { name: 'Стандартний', min: '150 000 грн', discount: '10%', color: 'border-blue-200', badge: 'bg-blue-50 text-blue-700' },
    { name: 'Преміум', min: '500 000 грн', discount: '15%', color: 'border-orange-200', badge: 'bg-orange-50 text-orange-700' },
    { name: 'Ексклюзивний', min: '1 000 000 грн', discount: '20%', color: 'border-yellow-400', badge: 'bg-yellow-50 text-yellow-700' },
  ]

  const steps = [
    { num: '1', title: 'Реєстрація', desc: 'Заповніть заявку та надайте документи юридичної особи або ФОП' },
    { num: '2', title: 'Верифікація', desc: 'Перевірка документів та погодження умов — до 3 робочих днів' },
    { num: '3', title: 'Підписання договору', desc: 'Підписання договору поставки та відкриття особистого кабінету' },
    { num: '4', title: 'Перше замовлення', desc: 'Оформлення першого замовлення з персональним менеджером' },
  ]

  const documents = [
    'Виписка з ЄДР (не старіша 30 днів)',
    'Копія паспорта директора / ФОП',
    'Копія ідентифікаційного коду',
    'Свідоцтво платника ПДВ (за наявності)',
    'Банківські реквізити',
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-3xl font-bold text-gray-900'}>{'Оптові закупівлі'}</h1>
        <p className={'mt-3 text-gray-500 max-w-2xl mx-auto'}>
          {'Понад 500 оптових клієнтів вже обирають NestHub для свого бізнесу. Станьте частиною нашої ділової спільноти.'}
        </p>
      </div>

      {/* Спеціальна пропозиція */}
      <div className={'bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white'}>
        <h2 className={'text-xl font-bold mb-2'}>{'Спеціальна пропозиція для нових оптових партнерів'}</h2>
        <p className={'text-gray-300 text-sm'}>{'Додаткова знижка 7% на перше замовлення від 50 000 грн. Пропозиція діє протягом перших 30 днів після реєстрації.'}</p>
      </div>

      {/* Переваги */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Переваги оптових закупівель'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
          {benefits.map(({ icon, title, desc }) => (
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

      {/* Рівні знижок */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Система знижок'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'}>
          {tiers.map(({ name, min, discount, color, badge }) => (
            <div key={name} className={`rounded-xl border-2 ${color} p-5 flex flex-col gap-2`}>
              <span className={`self-start px-2.5 py-1 rounded-md text-xs font-semibold ${badge}`}>
                {name}
              </span>
              <p className={'text-2xl font-bold text-gray-900'}>{discount}</p>
              <p className={'text-xs text-gray-500'}>{'знижка'}</p>
              <div className={'border-t border-gray-100 pt-2 mt-1'}>
                <p className={'text-xs text-gray-400'}>{'від'}</p>
                <p className={'text-sm font-semibold text-gray-700'}>{min}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Процес */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Як стати оптовим клієнтом'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'}>
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

      {/* Документи */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Необхідні документи'}</h2>
        <ul className={'flex flex-col gap-2'}>
          {documents.map((doc) => (
            <li key={doc} className={'flex items-center gap-3 p-3 rounded-xl bg-gray-50'}>
              <span className={'text-gray-400'}>{'📄'}</span>
              <p className={'text-sm text-gray-700'}>{doc}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Контакти */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Відділ оптових продажів'}</h2>
        <p className={'text-sm text-gray-600'}>{'Email: '}<span className={'text-blue-600'}>{'wholesale@nesthub.ua'}</span></p>
        <p className={'text-sm text-gray-600 mt-1'}>{'Телефон: +38 (096) 743-82-36'}</p>
        <p className={'text-xs text-gray-400 mt-1'}>{'Пн–Пт: 9:00–18:00'}</p>
        <button type={'button'} className={'mt-4 px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 cursor-pointer font-[inherit]'}>
          {'Подати заявку'}
        </button>
      </div>
    </div>
  )
}
