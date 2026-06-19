export default function PartnershipPage() {
  const types = [
    {
      icon: '🏭',
      title: 'Постачальник',
      desc: 'Постачайте товари на нашу платформу та отримайте доступ до понад 50 000 активних покупців.',
      benefits: ['Гарантовані закупівлі', 'Маркетингова підтримка', 'Зручний особистий кабінет'],
    },
    {
      icon: '📦',
      title: 'Дропшипінг',
      desc: 'Продавайте наші товари без власного складу. Ми відправляємо від свого імені або з вашим брендингом.',
      benefits: ['Без інвестицій у склад', 'Готовий каталог товарів', 'Автоматична синхронізація'],
    },
    {
      icon: '💰',
      title: 'Партнерська програма',
      desc: 'Рекомендуйте NestHub та отримуйте комісію з кожного продажу за вашим посиланням.',
      benefits: ['До 8% комісії', 'Щомісячні виплати', 'Детальна аналітика'],
    },
    {
      icon: '🏪',
      title: 'Франшиза',
      desc: 'Відкрийте офлайн-точку видачі або шоурум під брендом NestHub у своєму місті.',
      benefits: ['Готова бізнес-модель', 'Навчання та підтримка', 'Спільний маркетинг'],
    },
  ]

  const stats = [
    { value: '500+', label: 'партнерів по Україні', color: 'text-blue-600' },
    { value: '98%', label: 'партнерів продовжують співпрацю', color: 'text-green-600' },
    { value: '7 днів', label: 'середній час старту', color: 'text-orange-500' },
  ]

  const processSteps = [
    { num: '1', title: 'Заповніть заявку', desc: 'Надішліть форму нижче з описом вашого бізнесу та інтересів' },
    { num: '2', title: 'Консультація', desc: 'Наш менеджер зв\'яжеться з вами протягом 1 робочого дня' },
    { num: '3', title: 'Підписання угоди', desc: 'Оформлення договору та доступ до партнерського кабінету' },
    { num: '4', title: 'Налаштування', desc: 'Технічна інтеграція, навчання та старт роботи' },
    { num: '5', title: 'Підтримка', desc: 'Постійна підтримка та розвиток партнерства' },
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6 sm:gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-2xl sm:text-3xl font-bold text-gray-900'}>{'Партнерство з CoreNest'}</h1>
        <p className={'mt-3 text-gray-500 max-w-2xl mx-auto'}>
          {'Розвивайте свій бізнес разом з нами. Оберіть формат партнерства, що підходить саме вам.'}
        </p>
      </div>

      {/* Типи партнерства */}
      <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        {types.map(({ icon, title, desc, benefits }) => (
          <div key={title} className={'bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-3'}>
            <span className={'text-3xl'}>{icon}</span>
            <p className={'font-bold text-gray-900'}>{title}</p>
            <p className={'text-sm text-gray-500'}>{desc}</p>
            <ul className={'flex flex-col gap-1 mt-1'}>
              {benefits.map((b) => (
                <li key={b} className={'flex items-center gap-2 text-sm text-gray-700'}>
                  <span className={'text-green-500'}>{'✓'}</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Статистика */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Чому обирають нас'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-3 gap-6'}>
          {stats.map(({ value, label, color }) => (
            <div key={label} className={'text-center'}>
              <p className={`text-3xl sm:text-4xl font-bold ${color}`}>{value}</p>
              <p className={'mt-1 text-sm text-gray-500'}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Процес */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Як стати партнером'}</h2>
        <div className={'flex flex-col gap-0'}>
          {processSteps.map(({ num, title, desc }, i) => (
            <div key={num} className={'flex gap-4'}>
              <div className={'flex flex-col items-center'}>
                <div className={'w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0'}>
                  {num}
                </div>
                {i < processSteps.length - 1 && <div className={'w-0.5 flex-1 bg-gray-200 my-1'} />}
              </div>
              <div className={'pb-5'}>
                <p className={'font-semibold text-gray-900 text-sm'}>{title}</p>
                <p className={'text-xs text-gray-500 mt-0.5'}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Форма заявки */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Заявка на партнерство'}</h2>
        <form className={'flex flex-col gap-4 max-w-xl'}>
          <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
            <div className={'flex flex-col gap-1.5'}>
              <label className={'text-sm font-medium text-gray-700'}>{'Ім\'я'}</label>
              <input type={'text'} placeholder={'Ваше ім\'я'} className={'h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400'} />
            </div>
            <div className={'flex flex-col gap-1.5'}>
              <label className={'text-sm font-medium text-gray-700'}>{'Компанія'}</label>
              <input type={'text'} placeholder={'Назва компанії'} className={'h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400'} />
            </div>
          </div>
          <div className={'flex flex-col gap-1.5'}>
            <label className={'text-sm font-medium text-gray-700'}>{'Email'}</label>
            <input type={'email'} placeholder={'email@example.com'} className={'h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400'} />
          </div>
          <div className={'flex flex-col gap-1.5'}>
            <label className={'text-sm font-medium text-gray-700'}>{'Тип партнерства'}</label>
            <select className={'h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400 bg-white'}>
              <option value={''}>{'Оберіть тип'}</option>
              <option value={'supplier'}>{'Постачальник'}</option>
              <option value={'dropshipping'}>{'Дропшипінг'}</option>
              <option value={'affiliate'}>{'Партнерська програма'}</option>
              <option value={'franchise'}>{'Франшиза'}</option>
            </select>
          </div>
          <div className={'flex flex-col gap-1.5'}>
            <label className={'text-sm font-medium text-gray-700'}>{'Повідомлення'}</label>
            <textarea rows={3} placeholder={'Розкажіть про свій бізнес...'} className={'rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none'} />
          </div>
          <button type={'button'} className={'self-start px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 cursor-pointer font-[inherit]'}>
            {'Надіслати заявку'}
          </button>
        </form>
      </div>

      {/* Контакти */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Контакти партнерського відділу'}</h2>
        <p className={'text-sm text-gray-600'}>{'Email: '}<span className={'text-blue-600'}>{'partners@nesthub.ua'}</span></p>
        <p className={'text-sm text-gray-600 mt-1'}>{'Телефон: +38 (096) 743-82-39'}</p>
        <p className={'text-xs text-gray-400 mt-1'}>{'Пн–Пт: 9:00–18:00'}</p>
      </div>
    </div>
  )
}
