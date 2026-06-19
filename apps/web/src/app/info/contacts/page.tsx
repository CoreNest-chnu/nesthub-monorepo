export default function ContactsPage() {
  const departments = [
    { name: 'Служба підтримки', phone: '+38 (096) 743-82-33', email: 'support@nesthub.ua', hours: 'Пн–Нд: 8:00–22:00' },
    { name: 'Відділ продажів', phone: '+38 (096) 743-82-34', email: 'sales@nesthub.ua', hours: 'Пн–Пт: 9:00–18:00' },
    { name: 'Відділ повернень', phone: '+38 (096) 743-82-35', email: 'returns@nesthub.ua', hours: 'Пн–Пт: 9:00–18:00' },
    { name: 'Оптові закупівлі', phone: '+38 (096) 743-82-36', email: 'wholesale@nesthub.ua', hours: 'Пн–Пт: 9:00–18:00' },
  ]

  const offices = [
    { city: 'Чернівці (головний офіс)', address: 'вул. Рівненська, 16', phone: '+38 (096) 743-82-33' },
    { city: 'Київ', address: 'вул. Хрещатик, 22', phone: '+38 (044) 123-45-67' },
    { city: 'Львів', address: 'вул. Городоцька, 48', phone: '+38 (032) 234-56-78' },
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6 sm:gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-2xl sm:text-3xl font-bold text-gray-900'}>{'Контакти'}</h1>
        <p className={'mt-3 text-gray-500'}>{'Ми завжди на зв\'язку. Оберіть зручний спосіб звернення.'}</p>
      </div>

      {/* Головний офіс */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Головний офіс'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-3 gap-6'}>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-xs font-semibold text-gray-400 uppercase tracking-wide'}>{'Адреса'}</p>
            <p className={'text-sm text-gray-900'}>{'м. Чернівці, вул. Рівненська, 16'}</p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-xs font-semibold text-gray-400 uppercase tracking-wide'}>{'Телефони'}</p>
            <p className={'text-sm text-gray-900'}>{'+38 (096) 743-82-33'}</p>
            <p className={'text-sm text-gray-900'}>{'+38 (096) 743-82-34'}</p>
          </div>
          <div className={'flex flex-col gap-1'}>
            <p className={'text-xs font-semibold text-gray-400 uppercase tracking-wide'}>{'Години роботи'}</p>
            <p className={'text-sm text-gray-900'}>{'Пн–Пт: 9:00–18:00'}</p>
            <p className={'text-sm text-gray-500'}>{'Сб–Нд: вихідний'}</p>
          </div>
        </div>
      </div>

      {/* Карта */}
      <div className={'bg-gray-100 rounded-2xl border border-gray-200 h-64 flex items-center justify-center'}>
        <p className={'text-gray-400 text-sm'}>{'🗺️ Інтерактивна карта'}</p>
      </div>

      {/* Відділи */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Контакти відділів'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
          {departments.map(({ name, phone, email, hours }) => (
            <div key={name} className={'border border-gray-100 rounded-xl p-4 flex flex-col gap-1'}>
              <p className={'font-semibold text-gray-900 text-sm'}>{name}</p>
              <p className={'text-sm text-gray-600'}>{phone}</p>
              <p className={'text-sm text-blue-600'}>{email}</p>
              <p className={'text-xs text-gray-400'}>{hours}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Офіси */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Наші офіси'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-3 gap-4'}>
          {offices.map(({ city, address, phone }) => (
            <div key={city} className={'p-4 rounded-xl bg-gray-50 flex flex-col gap-1'}>
              <p className={'font-semibold text-gray-900 text-sm'}>{city}</p>
              <p className={'text-sm text-gray-500'}>{address}</p>
              <p className={'text-sm text-gray-600'}>{phone}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Форма зворотнього зв'язку */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Зворотній зв\'язок'}</h2>
        <form className={'flex flex-col gap-4 max-w-xl'}>
          <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
            <div className={'flex flex-col gap-1.5'}>
              <label className={'text-sm font-medium text-gray-700'}>{'Ім\'я'}</label>
              <input type={'text'} placeholder={'Ваше ім\'я'} className={'h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400'} />
            </div>
            <div className={'flex flex-col gap-1.5'}>
              <label className={'text-sm font-medium text-gray-700'}>{'Email'}</label>
              <input type={'email'} placeholder={'email@example.com'} className={'h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400'} />
            </div>
          </div>
          <div className={'flex flex-col gap-1.5'}>
            <label className={'text-sm font-medium text-gray-700'}>{'Тема'}</label>
            <input type={'text'} placeholder={'Тема звернення'} className={'h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400'} />
          </div>
          <div className={'flex flex-col gap-1.5'}>
            <label className={'text-sm font-medium text-gray-700'}>{'Повідомлення'}</label>
            <textarea rows={4} placeholder={'Ваше повідомлення...'} className={'rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none'} />
          </div>
          <button type={'button'} className={'self-start px-6 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 cursor-pointer font-[inherit]'}>
            {'Надіслати'}
          </button>
        </form>
      </div>

      {/* Соціальні мережі */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-5 sm:p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Ми в соціальних мережах'}</h2>
        <div className={'flex gap-4 flex-wrap'}>
          {['Instagram', 'Facebook', 'Telegram', 'YouTube'].map((s) => (
            <span key={s} className={'px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 font-medium'}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
