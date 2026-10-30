import type { ReactNode } from 'react'
import { Sheet } from './Sheet'
import { Pct } from './Pct'
import { ProgressBar } from './ui'
import {
  branchProgress,
  currentWeek,
  daysLeft,
  seasonPercent,
  streak,
  weekPerformance,
} from '../app/engine'
import type { AppState } from '../app/types'

export function PulseSheet({
  open,
  state,
  onClose,
}: {
  open: boolean
  state: AppState
  onClose: () => void
}) {
  const season = state.season
  if (!season) return null

  const progress = branchProgress(state)
  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Semana', value: `${currentWeek(season)} de ${season.weeks}` },
    { label: 'Esta semana', value: <Pct value={weekPerformance(state)} /> },
    { label: 'Temporada', value: <Pct value={seasonPercent(progress)} /> },
    { label: 'Racha', value: `${streak(state)} días` },
    { label: 'Quedan', value: `${daysLeft(season)} días` },
  ]

  return (
    <Sheet
      open={open}
      title="Estado del sistema"
      subtitle="Lo que llevas hecho de lo que tu sistema te ha pedido."
      onClose={onClose}
    >
      <dl className="pulse">
        {rows.map((row) => (
          <div key={row.label} className="pulse__row">
            <dt>{row.label}</dt>
            <dd className="num">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="stack stack--tight pulse__branches">
        {progress.map((p) => (
          <div key={p.branch.id} className="pulse__branch">
            <div className="pulse__branch-head">
              <span>{p.branch.name}</span>
              <span className="num"><Pct value={p.percent} /></span>
            </div>
            <ProgressBar
              value={p.percent}
              color="var(--ink)"
              label={`Cumplimiento de ${p.branch.name}`}
            />
            <p className="pulse__branch-note num">
              {p.done} de {p.total} movimientos confirmados
            </p>
          </div>
        ))}
      </div>
    </Sheet>
  )
}
