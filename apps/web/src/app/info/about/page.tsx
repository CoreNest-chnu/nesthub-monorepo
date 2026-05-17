export default function AboutPage() {
  const stats = [
    { value: '15 000+', label: 'товарів у каталозі', color: 'text-green-600' },
    { value: '50 000+', label: 'задоволених клієнтів', color: 'text-blue-600' },
    { value: '120', label: 'міст доставки', color: 'text-red-500' },
  ]

  const values = [
    { icon: '💡', title: 'Інновації', desc: 'Ми постійно впроваджуємо нові технології та рішення' },
    { icon: '🛡️', title: 'Надійність', desc: 'Гарантуємо якість та безпеку кожної покупки' },
    { icon: '❤️', title: 'Клієнтоорієнтованість', desc: 'Клієнт — у центрі всього, що ми робимо' },
    { icon: '⭐', title: 'Якість', desc: 'Лише перевірені бренди та сертифікована продукція' },
  ]

  const timeline = [
    { year: '2020', title: 'Заснування компанії', desc: 'CoreNest відкрила двері та запустила перший інтернет-магазин товарів для дому', active: false },
    { year: '2021', title: 'Розширення асортименту', desc: 'Додали понад 5 000 нових позицій та відкрили перший склад у Києві', active: false },
    { year: '2023', title: 'Загальнонаціональне визнання', desc: 'Увійшли до топ-10 інтернет-магазинів України за версією клієнтів', active: false },
    { year: '2026', title: 'Нові горизонти', desc: 'Запуск нової платформи NestHub і вихід на міжнародний ринок', active: true },
  ]

  const reasons = [
    { title: 'Широкий асортимент', desc: 'понад 15 000 товарів для дому та офісу' },
    { title: 'Швидка доставка', desc: 'по всій Україні від 1 до 3 днів' },
    { title: 'Офіційна гарантія', desc: 'на весь товар від виробника' },
    { title: 'Зручна оплата', desc: 'готівка, карта, оплата частинами' },
    { title: 'Сертифікована продукція', desc: 'лише перевірені постачальники' },
    { title: 'Підтримка 24/7', desc: "наша команда завжди на зв'язку" },
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-3xl font-bold text-gray-900'}>{'Про компанію CoreNest'}</h1>
        <p className={'mt-3 text-gray-500 max-w-2xl mx-auto'}>
          {'Ми — українська компанія, що спеціалізується на продажу товарів для дому та офісу. Наша місія — зробити ваш простір комфортним та затишним.'}
        </p>
      </div>

      {/* Хто ми */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Хто ми'}</h2>
        <p className={'text-gray-600 leading-relaxed'}>
          {'CoreNest — це команда однодумців, яка вірить, що кожен заслуговує на красивий та зручний дім. Ми ретельно відбираємо кожен товар, співпрацюємо лише з перевіреними виробниками та постачальниками, щоб ви отримували лише найкраще. З 2020 року ми допомогли понад 50 000 клієнтам знайти товари, які роблять їхнє життя кращим.'}
        </p>
      </div>

      {/* Наші досягнення */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Наші досягнення'}</h2>
        <div className={'grid grid-cols-3 gap-6'}>
          {stats.map(({ value, label, color }) => (
            <div key={label} className={'text-center'}>
              <p className={`text-4xl font-bold ${color}`}>{value}</p>
              <p className={'mt-1 text-sm text-gray-500'}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Наші цінності */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Наші цінності'}</h2>
        <div className={'grid grid-cols-2 gap-4 sm:grid-cols-4'}>
          {values.map(({ icon, title, desc }) => (
            <div key={title} className={'flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-gray-50'}>
              <span className={'text-3xl'}>{icon}</span>
              <p className={'font-semibold text-gray-900 text-sm'}>{title}</p>
              <p className={'text-xs text-gray-500'}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Наша історія */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Наша історія'}</h2>
        <div className={'flex flex-col gap-0'}>
          {timeline.map(({ year, title, desc, active }, i) => (
            <div key={year} className={'flex gap-4'}>
              <div className={'flex flex-col items-center'}>
                <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${active ? 'bg-green-500' : 'bg-gray-300'}`} />
                {i < timeline.length - 1 && <div className={'w-0.5 flex-1 bg-gray-200 my-1'} />}
              </div>
              <div className={'pb-6'}>
                <p className={'text-xs font-semibold text-gray-400 uppercase tracking-wide'}>{year}</p>
                <p className={'font-semibold text-gray-900 mt-0.5'}>{title}</p>
                <p className={'text-sm text-gray-500 mt-1'}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Чому обирають CoreNest */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Чому обирають CoreNest'}</h2>
        <div className={'grid grid-cols-2 gap-3 sm:grid-cols-3'}>
          {reasons.map(({ title, desc }) => (
            <div key={title} className={'flex items-start gap-3 p-4 rounded-xl bg-gray-50'}>
              <span className={'text-green-500 mt-0.5 flex-shrink-0'}>{'✓'}</span>
              <div>
                <p className={'text-sm font-semibold text-gray-900'}>{title}</p>
                <p className={'text-xs text-gray-500 mt-0.5'}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
