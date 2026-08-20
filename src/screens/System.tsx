import { useState } from 'react'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { Screen } from '../components/Screen'
import { Orb } from '../components/Orb'
import { Sheet } from '../components/Sheet'
import { SystemTree } from '../components/SystemTree'
import { Button, Field, Overline, ProgressBar, Segmented, TextField } from '../components/ui'
import { PILLARS } from '../app/pillars'
import {
  branchProgress,
  currentWeek,
  daysLeft,
  nextMovement,
  seasonPercent,
  weakestBranch,
} from '../app/engine'
import { useStore } from '../app/store'
import type { Movement } from '../app/types'

const DURATIONS = [8, 12, 16, 24]

interface Props {
  onOpenMovement: (movement: Movement) => void
  onOpenBranch: (branchId: string) => void
  onPulse: () => void
  onDone: (movement: Movement) => void
}

export function System({ onOpenMovement, onOpenBranch, onPulse, onDone }: Props) {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState(false)
  const season = state.season
  if (!season) return null

  const progress = branchProgress(state)
  const weak = weakestBranch(progress)
  const percent = seasonPercent(progress)
  const week = currentWeek(season)
  const next = nextMovement(state)
  const nextBranch = next ? season.branches.find((b) => b.id === next.branchId) : undefined

  return (
    <Screen title="Sistema" subtitle="Tu sistema. Tu enfoque. Tu evolución." onPulse={onPulse}>
      <button type="button" className="season" onClick={() => setEditing(true)}>
        <Orb size={230} />
        <span className="season__content">
          <Overline>Temporada actual</Overline>
          <span className="season__purpose">{season.purpose}</span>
          <span className="season__week num">
            Semana {week} de {season.weeks} · quedan {daysLeft(season)} días
          </span>
          <span className="season__percent num">{percent}%</span>
          <span className="season__label">Cumplimiento del plan</span>
          <ProgressBar value={percent} label="Cumplimiento de la temporada" />
        </span>
        <span className="season__go" aria-hidden>
          <ArrowRight size={20} strokeWidth={2.2} />
        </span>
      </button>

      <SystemTree progress={progress} weakestId={weak?.branch.id} onOpen={onOpenBranch} />

      {next && nextBranch ? (
        <div className="next">
          <button type="button" className="next__main" onClick={() => onOpenMovement(next)}>
            <span className="next__text">
              <Overline>Siguiente movimiento</Overline>
              <span className="next__title">{next.title}</span>
              <span className="next__meta num">
                <Clock size={14} strokeWidth={2} aria-hidden />
                {next.minutes} min · {nextBranch.name}
              </span>
            </span>
            <span className="next__go" aria-hidden style={{ '--tone': PILLARS[nextBranch.pillar].color } as React.CSSProperties}>
              <ArrowRight size={19} strokeWidth={2.2} />
            </span>
          </button>
          <Button
            variant="secondary"
            full
            icon={<Check size={17} strokeWidth={2.4} aria-hidden />}
            onClick={() => onDone(next)}
          >
            Hecho
          </Button>
        </div>
      ) : (
        <div className="empty">
          <p className="empty__title">Nada pendiente en el plan</p>
          <p className="empty__text">
            Has confirmado o descartado todos los movimientos de la temporada. Amplía la duración
            desde la tarjeta de arriba o empieza una temporada nueva desde Perfil.
          </p>
        </div>
      )}

      <Sheet
        open={editing}
        title="Temporada"
        subtitle="Cambiar el rumbo no rompe lo que ya llevas hecho."
        onClose={() => setEditing(false)}
        footer={
          <Button full onClick={() => setEditing(false)}>
            Listo
          </Button>
        }
      >
        <div className="stack">
          <Field
            label="Objetivo"
            value={season.purpose}
            maxLength={40}
            onChange={(e) => dispatch({ type: 'update-season', patch: { purpose: e.target.value } })}
          />
          <TextField
            label="Qué significa para ti"
            value={season.purposeDetail}
            maxLength={120}
            onChange={(e) =>
              dispatch({ type: 'update-season', patch: { purposeDetail: e.target.value } })
            }
          />
          <div className="stack stack--tight">
            <p className="overline">Duración</p>
            <Segmented
              label="Duración de la temporada"
              size="sm"
              value={String(season.weeks)}
              onChange={(value) =>
                dispatch({ type: 'update-season', patch: { weeks: Number(value) } })
              }
              options={DURATIONS.map((d) => ({ value: String(d), label: `${d} sem.` }))}
            />
            <p className="hint">
              Alargarla añade movimientos al final. Acortarla retira los que aún no han llegado;
              vas por la semana {week}.
            </p>
          </div>
        </div>
      </Sheet>
    </Screen>
  )
}
