import { ArrowRight, Clock, SignalHigh } from 'lucide-react'
import { Pct } from '../components/Pct'
import { Screen } from '../components/Screen'
import { Index } from '../components/Index'
import { ProgressBar } from '../components/ui'
import { branchProgress, greeting, nextMovement, weakestBranch } from '../app/engine'
import { useStore } from '../app/store'
import type { Movement } from '../app/types'

interface Props {
  onOpenMovement: (movement: Movement) => void
  onOpenBranch: (branchId: string) => void
  onPulse: () => void
  onReview: () => void
}

function splitTitle(title: string): [string, string | null] {
  const parts = title.split(' · ')
  return parts.length > 1 ? [parts[0], parts.slice(1).join(' · ')] : [title, null]
}

export function Today({ onOpenMovement, onOpenBranch, onPulse, onReview }: Props) {
  const { state } = useStore()
  const season = state.season
  if (!season) return null

  const progress = branchProgress(state)
  const weak = weakestBranch(progress)
  const next = nextMovement(state)
  const nextBranch = next ? season.branches.find((b) => b.id === next.branchId) : undefined
  const [lead, tail] = next ? splitTitle(next.title) : ['', null]

  return (
    <Screen onPulse={onPulse}>
      <div className="greeting">
        <p className="greeting__hello">
          {greeting()}, {state.name}
        </p>
        <p className="greeting__mantra">{season.purposeDetail || season.purpose}</p>
      </div>

      {next && nextBranch ? (
        <button type="button" className="hero" onClick={() => onOpenMovement(next)}>
          <span className="hero__content">
            <span className="hero__title">01 · Tu siguiente movimiento</span>
            <span className="hero__branch">{nextBranch.name}</span>
            <span className="hero__move">{tail ?? lead}</span>
            {tail ? <span className="hero__lead">{lead}</span> : null}
            <span className="meta-row hero__meta">
              <span className="meta">
                <Clock size={13} strokeWidth={2} aria-hidden />
                {next.minutes} min
              </span>
              <span className="meta">
                <SignalHigh size={13} strokeWidth={2} aria-hidden />
                Dificultad <b>{next.difficulty}</b>
              </span>
            </span>
          </span>
          <span className="hero__go" aria-hidden>
            <ArrowRight size={18} strokeWidth={2.2} />
          </span>
        </button>
      ) : (
        <div className="hero hero--calm">
          <span className="hero__content">
            <span className="hero__title">01 · Temporada cumplida</span>
            <span className="hero__move">Nada pendiente</span>
            <span className="hero__branch">
              Has resuelto todos los movimientos del plan. Cierra la semana en Revisión y decide
              la siguiente temporada.
            </span>
          </span>
          <button type="button" className="link" onClick={onReview}>
            Ir a la revisión
          </button>
        </div>
      )}

      <div className="section-title">
        <h2>Camino vivo</h2>
        <p>Tres ramas. Un mismo propósito.</p>
      </div>

      <ul className="branch-list">
        {progress.map((p, i) => {
          const neglected = p.branch.id === weak?.branch.id
          return (
            <li key={p.branch.id}>
              <button
                type="button"
                className={`branch-card ${neglected ? 'is-neglected' : ''}`}
                onClick={() => onOpenBranch(p.branch.id)}
              >
                <span className="branch-card__index">
                  <Index n={i + 2} label={neglected ? 'Más descuidada' : undefined} />
                  {neglected ? <span className="dot-alert" aria-hidden /> : null}
                </span>
                <span className="branch-card__text">
                  <span className="branch-card__name">{p.branch.name}</span>
                  <span className="branch-card__goal">{p.branch.goal}</span>
                </span>
                <span className="branch-card__percent"><Pct value={p.percent} /></span>
                <span className="branch-card__bar">
                  <ProgressBar
                    value={p.percent}
                    color={neglected ? 'var(--alert)' : 'var(--ink)'}
                    label={`Cumplimiento de ${p.branch.name}`}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Screen>
  )
}
