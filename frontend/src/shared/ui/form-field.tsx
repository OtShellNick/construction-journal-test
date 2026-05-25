import type { ReactNode } from 'react'
import { Label } from './label'

interface FormFieldProps {
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, error, optional, children, className }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <Label>
        {label}
        {optional && (
          <span className="text-muted-foreground font-normal"> (необязательно)</span>
        )}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
