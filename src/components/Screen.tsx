import { Activity, ChevronLeft } from 'lucide-react'
import { BrandSign } from './Brand'
import type { ReactNode } from 'react'

interface ScreenProps {
  /** Título en versalita serif; si falta se usa el logotipo. */
  title?: string
  subtitle?: string
  onPulse?: () => void
  onBack?: () => void
  backLabel?: string
  children: ReactNode
}

export function Screen({ title, subtitle, onPulse, onBack, backLabel, children }: ScreenProps) {
  return (
    <div className="screen">
      <header className="screen__head">
        {onBack ? (
          <button type="button" className="screen__back" onClick={onBack}>
            <ChevronLeft size={20} strokeWidth={2.2} aria-hidden />
            {backLabel ?? 'Atrás'}
          </button>
        ) : title ? (
          <p className="screen__title">{title}</p>
        ) : (
          <BrandSign className="screen__wordmark" />
        )}
        {onPulse ? (
          <button
            type="button"
            className="screen__pulse"
            onClick={onPulse}
            aria-label="Estado del sistema"
          >
            <Activity size={18} strokeWidth={2} aria-hidden />
          </button>
        ) : null}
      </header>
      {subtitle ? <p className="screen__subtitle">{subtitle}</p> : null}
      <div className="screen__body">{children}</div>
    </div>
  )
}
