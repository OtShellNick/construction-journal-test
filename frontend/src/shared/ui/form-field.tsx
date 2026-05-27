import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'
import { Label } from './label'

/** Пропсы компонента поля формы. */
interface FormFieldProps {
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
  className?: string
}

/**
 * Обёртка для поля формы: метка, содержимое, сообщение об ошибке.
 * @param props - Пропсы поля формы
 */
export function FormField({ label, error, optional, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
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
