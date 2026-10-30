import { Check, ChevronRight, SkipForward } from 'lucide-react'
import { plannedDayName } from '../app/engine'
import type { Movement } from '../app/types'

export function MovementRow({ movement, onOpen }: { movement: Movement; onOpen: () => void }) {
  const done = movement.status === 'hecho'
  const skipped = movement.status === 'saltado'

  return (
    <li>
      <button type="button" className={`move-row ${done ? 'is-done' : ''}`} onClick={onOpen}>
        <span
          className="move-row__mark"
          style={done ? { background: 'var(--ink)', color: 'var(--ink-inverse)' } : undefined}
        >
          {done ? <Check size={12} strokeWidth={3} aria-hidden /> : null}
          {skipped ? <SkipForward size={11} strokeWidth={2.4} aria-hidden /> : null}
        </span>
        <span className="move-row__text">
          <span className="move-row__title">{movement.title}</span>
          <span className="move-row__meta num">
            {plannedDayName(movement)} · {movement.minutes} min
            {skipped ? ' · saltado' : ''}
          </span>
        </span>
        <ChevronRight size={16} strokeWidth={2} className="move-row__chevron" aria-hidden />
      </button>
    </li>
  )
}
