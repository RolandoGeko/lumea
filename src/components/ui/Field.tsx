import type { ReactNode } from 'react'

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {optional && <span className="font-normal text-piedra">(opcional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-piedra">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined
