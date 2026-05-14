'use client'

import { useEffect, useState } from 'react'

const steps = ['Кошик', 'Доставка', 'Оплата', 'Підтвердження']

type StepIndicatorProps = {
  current?: number
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  current = 0,
}) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className={'flex items-center mb-8'}>
      {steps.map((step, i) => {
        const isPast = i < current
        const isActive = i === current

        // each completed line animates 220ms apart; active circle pops after the last line
        const lineDelay = i * 220
        const circleDelay = current * 220 + 180

        return (
          <div key={step} className={'flex items-center flex-1 last:flex-none'}>
            <div
              className={`flex items-center gap-2 ${
                isActive || isPast ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              <span
                className={
                  'flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold'
                }
                style={{
                  backgroundColor:
                    isActive || isPast ? '#111827' : '#e5e7eb',
                  color: isActive || isPast ? '#fff' : '#6b7280',
                  transform:
                    ready && isActive ? 'scale(1.18)' : 'scale(1)',
                  boxShadow:
                    ready && isActive
                      ? '0 0 0 5px rgba(17,24,39,0.12)'
                      : '0 0 0 0px rgba(17,24,39,0)',
                  transition: isActive
                    ? `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${circleDelay}ms, box-shadow 0.4s ease ${circleDelay}ms`
                    : 'none',
                }}
              >
                {i + 1}
              </span>
              <span className={'text-sm'}>{step}</span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={'flex-1 h-px bg-gray-200 mx-3 relative overflow-hidden'}
              >
                {isPast && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: '#111827',
                      transformOrigin: 'left',
                      transform: ready ? 'scaleX(1)' : 'scaleX(0)',
                      transition: `transform 0.4s ease ${lineDelay}ms`,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
