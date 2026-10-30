import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { Check } from 'lucide-react'

/* Botón ------------------------------------------------------------------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  icon?: ReactNode
  full?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  full = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${full ? 'btn--full' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className="btn__label">{children}</span>
      {loading ? <span className="btn__spinner" aria-hidden /> : icon}
    </button>
  )
}

/* Segmentado -------------------------------------------------------------- */

interface SegmentedProps<T extends string> {
  value: T
  options: { value: T; label: string; icon?: ReactNode }[]
  onChange: (value: T) => void
  label: string
  size?: 'sm' | 'md'
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  size = 'md',
}: SegmentedProps<T>) {
  return (
    <div className={`segmented segmented--${size}`} role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            className={`segmented__item ${active ? 'is-active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* Campos ------------------------------------------------------------------ */

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function Field({ label, hint, id, ...rest }: FieldProps) {
  const generated = useRef(`f-${Math.random().toString(36).slice(2, 8)}`).current
  const fieldId = id ?? generated
  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <input id={fieldId} className="field__input" {...rest} />
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  )
}

interface TextFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export function TextField({ label, hint, id, ...rest }: TextFieldProps) {
  const generated = useRef(`t-${Math.random().toString(36).slice(2, 8)}`).current
  const fieldId = id ?? generated
  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label}
      </label>
      <textarea id={fieldId} className="field__input field__input--area" rows={3} {...rest} />
      {hint ? <p className="field__hint">{hint}</p> : null}
    </div>
  )
}

/* Progreso ---------------------------------------------------------------- */

export function ProgressBar({
  value,
  color = 'var(--ink)',
  label,
}: {
  value: number
  color?: string
  label: string
}) {
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className="progress__fill" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

/* Títulos y etiquetas ------------------------------------------------------ */

export function SectionTitle({ title, note }: { title: string; note?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {note ? <p>{note}</p> : null}
    </div>
  )
}

export function Overline({ children }: { children: ReactNode }) {
  return <p className="overline">{children}</p>
}

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'tint' }) {
  return <span className={`tag tag--${tone}`}>{children}</span>
}

/* Avisos ------------------------------------------------------------------ */

interface ToastContext {
  notify: (message: string) => void
}

const ToastCtx = createContext<ToastContext | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const notify = useCallback((next: string) => {
    setMessage(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(null), 2600)
  }, [])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toast-host" aria-live="polite" role="status">
        {message ? (
          <div className="toast">
            <Check size={16} strokeWidth={2.4} aria-hidden />
            {message}
          </div>
        ) : null}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(): ToastContext {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
