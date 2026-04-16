"use client"

import { useId } from "react"

interface FieldProps {
  label: string
  error?: string
  children: (id: string) => React.ReactNode
}

export const Field: React.FC<FieldProps> = ({ label, error, children }) => {
  const id = useId()

  return (
    <div className={"flex flex-col gap-1"}>
      <label htmlFor={id} className={"text-sm font-medium text-gray-700"}>
        {label}
      </label>
      {children(id)}
      {error && (
        <p className={"text-xs text-red-500"}>{`⚠ ${error}`}</p>
      )}
    </div>
  )
}