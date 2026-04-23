'use client'

type FieldProps = {
  htmlFor: string
  label: string
  error?: string
  children: React.ReactNode
}

export const Field: React.FC<FieldProps> = ({
  htmlFor,
  label,
  error,
  children,
}) => {
  return (
    <div className={'flex flex-col gap-1'}>
      <label htmlFor={htmlFor} className={'text-sm font-medium text-gray-700'}>
        {label}
      </label>
      {children}
      {error && <p className={'text-xs text-red-500'}>{`⚠ ${error}`}</p>}
    </div>
  )
}
