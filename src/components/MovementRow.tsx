import { Check, ChevronRight, Clock, SkipForward } from 'lucide-react'
import { plannedDayName } from '../app/engine'
import type { Movement } from '../app/types'

export function MovementRow({
  movement,
  tone,
  onOpen,
}: {
  movement: Movement
  tone: string
  onOpen: () => void
}) {
  const done = movement.status === 'hecho'
  const skipped = movement.status === 'saltado'

  return (
    <li>
      <button type="button" className={`move-row ${done ? 'is-done' : ''}`} onClick={onOpen}>
        <span className="move-row__mark" style={done ? { background: tone, borderColor: tone } : undefined}>
          {done ? <Check size={13} strokeWidth={3} color="#000" aria-hidden /> : null}
          {skipped ? <SkipForward size={12} strokeWidth={2.4} aria-hidden /> : null}
        </span>
        <span className="move-row__text">
          <span className="move-row__title">{movement.title}</span>
          <span className="move-row__meta num">
            <Clock size={13} strokeWidth={2} aria-hidden />
            {plannedDayName(movement)} · {movement.minutes} min
            {skipped ? ' · saltado' : ''}
          </span>
        </span>
        <ChevronRight size={18} strokeWidth={2} className="move-row__chevron" aria-hidden />
      </button>
    </li>
  )
}
