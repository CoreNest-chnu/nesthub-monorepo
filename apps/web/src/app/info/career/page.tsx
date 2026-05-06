export default function CareerPage() {
  const benefits = [
    { icon: '📈', title: 'Кар\'єрне зростання', desc: 'Чіткі шляхи розвитку та регулярні перформанс-ревью' },
    { icon: '🎓', title: 'Навчання', desc: 'Корпоративні тренінги, курси та компенсація навчання' },
    { icon: '💰', title: 'Конкурентна зарплата', desc: 'Ринкові умови та бонуси за результат' },
    { icon: '🏠', title: 'Гнучкий графік', desc: 'Можливість дистанційної роботи та гнучкий початок дня' },
  ]

  const perks = [
    'Медичне страхування',
    'Корпоративні знижки на товари',
    'Оплачувана відпустка 24 дні',
    'Сучасний офіс у центрі міста',
    'Дружня команда однодумців',
    'Регулярні корпоративи та тімбілдинги',
  ]

  const vacancies = [
    {
      title: 'Frontend-розробник (React/Next.js)',
      department: 'IT-відділ',
      type: 'Повна зайнятість',
      requirements: ['Досвід від 2 років з React', 'Знання TypeScript', 'Досвід з Next.js', 'Розуміння REST API'],
    },
    {
      title: 'Менеджер з продажів',
      department: 'Відділ продажів',
      type: 'Повна зайнятість',
      requirements: ['Досвід продажів від 1 року', 'Комунікабельність', 'Знання CRM систем', 'Орієнтація на результат'],
    },
    {
      title: 'Оператор складу',
      department: 'Логістика',
      type: 'Повна зайнятість',
      requirements: ['Фізична витривалість', 'Уважність до деталей', 'Досвід роботи на складі'],
    },
    {
      title: 'SMM-спеціаліст',
      department: 'Маркетинг',
      type: 'Часткова зайнятість',
      requirements: ['Досвід ведення соціальних мереж', 'Навички копірайтингу', 'Базові знання графічних редакторів'],
    },
  ]

  const steps = [
    { num: '1', title: 'Надішліть резюме', desc: 'Заповніть форму або надішліть резюме на hr@nesthub.ua' },
    { num: '2', title: 'Первинна співбесіда', desc: 'Телефонна розмова з HR-менеджером (15–20 хв)' },
    { num: '3', title: 'Технічне інтерв\'ю', desc: 'Зустріч з керівником відділу або тестове завдання' },
    { num: '4', title: 'Оффер', desc: 'Ми зв\'яжемося з вами протягом 3 робочих днів' },
  ]

  return (
    <div className={'max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-10'}>
      {/* Hero */}
      <div className={'text-center'}>
        <h1 className={'text-3xl font-bold text-gray-900'}>{'Кар\'єра в CoreNest'}</h1>
        <p className={'mt-3 text-gray-500 max-w-2xl mx-auto'}>
          {'Приєднуйтесь до нашої команди і розвивайтесь разом з компанією, яка змінює ринок товарів для дому.'}
        </p>
      </div>

      {/* Чому ми */}
      <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4'}>
        {benefits.map(({ icon, title, desc }) => (
          <div key={title} className={'bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-2'}>
            <span className={'text-3xl'}>{icon}</span>
            <p className={'font-semibold text-gray-900'}>{title}</p>
            <p className={'text-sm text-gray-500'}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Переваги */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Що ми пропонуємо'}</h2>
        <div className={'grid grid-cols-1 sm:grid-cols-2 gap-3'}>
          {perks.map((perk) => (
            <div key={perk} className={'flex items-center gap-3 p-3 rounded-xl bg-gray-50'}>
              <span className={'text-green-500'}>{'✓'}</span>
              <p className={'text-sm text-gray-700'}>{perk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Вакансії */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Відкриті вакансії'}</h2>
        <div className={'flex flex-col gap-4'}>
          {vacancies.map(({ title, department, type, requirements }) => (
            <div key={title} className={'border border-gray-100 rounded-xl p-5'}>
              <div className={'flex items-start justify-between gap-4 flex-wrap'}>
                <div>
                  <p className={'font-semibold text-gray-900'}>{title}</p>
                  <div className={'flex items-center gap-2 mt-1'}>
                    <span className={'text-xs text-blue-600 font-medium'}>{department}</span>
                    <span className={'text-gray-300'}>{'·'}</span>
                    <span className={'text-xs text-gray-500'}>{type}</span>
                  </div>
                </div>
                <button type={'button'} className={'px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 cursor-pointer font-[inherit] flex-shrink-0'}>
                  {'Відгукнутися'}
                </button>
              </div>
              <ul className={'mt-3 flex flex-wrap gap-2'}>
                {requirements.map((req) => (
                  <li key={req} className={'px-2.5 py-1 rounded-md bg-gray-100 text-xs text-gray-600'}>{req}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Процес відбору */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-6'}>{'Процес відбору'}</h2>
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

      {/* HR контакти */}
      <div className={'bg-white rounded-2xl border border-gray-200 p-8'}>
        <h2 className={'text-xl font-bold text-gray-900 mb-4'}>{'Контакти HR-відділу'}</h2>
        <p className={'text-sm text-gray-600'}>{'Email: '}<span className={'text-blue-600'}>{'hr@nesthub.ua'}</span></p>
        <p className={'text-sm text-gray-600 mt-1'}>{'Телефон: +38 (096) 743-82-37'}</p>
        <p className={'text-sm text-gray-500 mt-3'}>
          {'Не знайшли підходящої вакансії? Надішліть відкрите резюме — ми зберігаємо їх у нашій базі та зв\'яжемося з вами при появі відповідної позиції.'}
        </p>
      </div>
    </div>
  )
}
