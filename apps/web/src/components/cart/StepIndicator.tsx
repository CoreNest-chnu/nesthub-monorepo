const steps = ['Кошик', 'Доставка', 'Оплата', 'Підтвердження']

type StepIndicatorProps = {
  current?: number
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  current = 0,
}) => (
  <div className={'flex items-center mb-8'}>
    {steps.map((step, i) => (
      <div key={step} className={'flex items-center flex-1 last:flex-none'}>
        <div
          className={`flex items-center gap-2 ${
            i === current ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${
              i === current
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i + 1}
          </span>
          <span className={'text-sm'}>{step}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={'flex-1 h-px bg-gray-200 mx-3'} />
        )}
      </div>
    ))}
  </div>
)
