export default function ReturnPage() {
  const excluded = [
    'Товари особистої гігієни',
    'Білизна та купальники',
    'Парфумерія та косметика',
    'Продукти харчування',
    'Програмне забезпечення з відкритою упаковкою',
    'Товари, виготовлені на замовлення',
  ]

  const steps = [
    {
      num: '1',
      title: 'Зв\'яжіться з нами',
      desc: 'Напишіть на returns@nesthub.ua або зателефонуйте: +38 (096) 743-82-35',
    },
    {
      num: '2',
      title: 'Отримайте підтвердження',
      desc: 'Наш менеджер обробить запит і надасть інструкції протягом 1 робочого дня',
    },
    {
      num: '3',
      title: 'Відправте товар',
      desc: 'Пакуйте товар в оригінальну упаковку та відправте Новою Поштою на наш склад',
    },
    {
      num: '4',
      title: 'Отримайте кошти',
      desc: 'Після перевірки товару кошти повернуть на вашу карту протягом 3–5 робочих днів',
    },
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-3xl font-bold text-gray-900'}>{'Повернення товару'}</h1>
        <p className={'mt-3 text-gray-500'}>{'Ми хочемо, щоб ви були задоволені покупкою. Якщо щось пішло не так — ми допоможемо.'}</p>
      </div>

      {/* Умови повернення */}
      <div className={'bg-blue-50 border border-blue-100 rounded-2xl p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-3'}>{'14 днів на повернення'}</h2>
        <p className={'text-sm text-gray-600 leading-relaxed'}>
          {'Відповідно до законодавства України, ви маєте право повернути товар належної якості протягом 14 днів з моменту отримання, якщо він не підійшов за розміром, формою, габаритами, фасоном, кольором або комплектацією. Товар має бути у первісному стані зі збереженням усіх ярликів, пломб та оригінальної упаковки.'}
        </p>
      </div>

      {/* Товари що не підлягають поверненню */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Товари, що не підлягають поверненню'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 gap-2'}>
          {excluded.map((item) => (
            <div key={item} className={'flex items-center gap-3 p-3 rounded-xl bg-gray-50'}>
              <span className={'text-red-400'}>{'✕'}</span>
              <p className={'text-sm text-gray-700'}>{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Процес повернення */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Як повернути товар'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'}>
          {steps.map(({ num, title, desc }) => (
            <div key={num} className={'flex flex-col gap-2'}>
              <div className={'w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0'}>
                {num}
              </div>
              <p className={'font-semibold text-gray-900 text-sm'}>{title}</p>
              <p className={'text-xs text-gray-500'}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Вартість повернення */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Вартість повернення'}</h2>
        <div className={'flex flex-col gap-4'}>
          <div className={'flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100'}>
            <span className={'text-green-600 font-bold mt-0.5'}>{'✓'}</span>
            <div>
              <p className={'font-semibold text-gray-900 text-sm'}>{'Дефект або помилка магазину'}</p>
              <p className={'text-xs text-gray-500 mt-0.5'}>{'Ми оплачуємо повернення товару та надаємо безкоштовну заміну або повне відшкодування'}</p>
            </div>
          </div>
          <div className={'flex items-start gap-3 p-4 rounded-xl bg-gray-50'}>
            <span className={'text-gray-500 font-bold mt-0.5'}>{'ℹ'}</span>
            <div>
              <p className={'font-semibold text-gray-900 text-sm'}>{'Не підійшов товар (належна якість)'}</p>
              <p className={'text-xs text-gray-500 mt-0.5'}>{'Вартість доставки при поверненні оплачує покупець'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Контакти */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Маєте запитання?'}</h2>
        <p className={'text-sm text-gray-600'}>{'Email: '}<span className={'text-blue-600'}>{'returns@nesthub.ua'}</span></p>
        <p className={'text-sm text-gray-600 mt-1'}>{'Телефон: +38 (096) 743-82-35'}</p>
        <p className={'text-xs text-gray-400 mt-1'}>{'Пн–Пт: 9:00–18:00'}</p>
        <button type={'button'} className={'mt-4 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 cursor-pointer font-[inherit]'}>
          {'Зв\'язатися з підтримкою'}
        </button>
      </div>
    </div>
  )
}
