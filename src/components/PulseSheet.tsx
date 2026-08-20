import { Sheet } from './Sheet'
import { ProgressBar } from './ui'
import { PILLARS } from '../app/pillars'
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
  const rows = [
    { label: 'Semana', value: `${currentWeek(season)} de ${season.weeks}` },
    { label: 'Rendimiento de esta semana', value: `${weekPerformance(state)}%` },
    { label: 'Cumplimiento de la temporada', value: `${seasonPercent(progress)}%` },
    { label: 'Racha de días cumplidos', value: `${streak(state)}` },
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
              <span className="num" style={{ color: PILLARS[p.branch.pillar].color }}>
                {p.percent}%
              </span>
            </div>
            <ProgressBar
              value={p.percent}
              color={PILLARS[p.branch.pillar].color}
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
