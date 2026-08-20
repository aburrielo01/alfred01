import { ArrowRight, ChevronRight, Clock, SignalHigh } from 'lucide-react'
import { Screen } from '../components/Screen'
import { Orb } from '../components/Orb'
import { BranchBadge } from '../components/BranchIcon'
import { ProgressBar } from '../components/ui'
import { PILLARS } from '../app/pillars'
import { branchProgress, greeting, nextMovement } from '../app/engine'
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
  const next = nextMovement(state)
  const nextBranch = next ? season.branches.find((b) => b.id === next.branchId) : undefined
  const [lead, tail] = next ? splitTitle(next.title) : ['', null]
  const tone = nextBranch ? PILLARS[nextBranch.pillar].color : 'var(--tint)'

  return (
    <Screen onPulse={onPulse}>
      <div className="greeting">
        <p className="greeting__hello">
          {greeting()}, {state.name}.
        </p>
        <p className="greeting__mantra">{season.purposeDetail || season.purpose}</p>
      </div>

      {next && nextBranch ? (
        <button type="button" className="hero" onClick={() => onOpenMovement(next)}>
          <Orb size={210} tone={tone} />
          <span className="hero__content">
            <span className="hero__title">Tu siguiente movimiento</span>
            <span className="hero__branch">{nextBranch.name}</span>
            <span className="hero__move" style={{ color: tone }}>
              {tail ?? lead}
            </span>
            {tail ? <span className="hero__lead">{lead}</span> : null}
            <span className="meta-row hero__meta">
              <span className="meta num">
                <Clock size={15} strokeWidth={2} aria-hidden />
                {next.minutes} min
              </span>
              <span className="meta">
                <SignalHigh size={15} strokeWidth={2} aria-hidden />
                Dificultad <b style={{ color: tone }}>{next.difficulty}</b>
              </span>
            </span>
          </span>
          <span className="hero__go" aria-hidden>
            <ArrowRight size={22} strokeWidth={2.2} />
          </span>
        </button>
      ) : (
        <div className="hero hero--calm">
          <span className="hero__content">
            <span className="hero__title">Temporada cumplida</span>
            <span className="hero__branch">
              No queda nada pendiente en el plan. Cierra la semana en Revisión y decide la
              siguiente temporada.
            </span>
          </span>
          <button type="button" className="link" onClick={onReview}>
            Ir a la revisión
          </button>
        </div>
      )}

      <section className="stack">
        <div className="section-title">
          <h2>Camino vivo</h2>
          <p>Tres ramas. Un mismo propósito.</p>
        </div>

        <ul className="branch-list">
          {progress.map((p) => {
            const pillar = PILLARS[p.branch.pillar]
            return (
              <li key={p.branch.id}>
                <button
                  type="button"
                  className="branch-card"
                  style={{ '--tone': pillar.color } as React.CSSProperties}
                  onClick={() => onOpenBranch(p.branch.id)}
                >
                  <BranchBadge pillar={p.branch.pillar} color={pillar.color} size={46} />
                  <span className="branch-card__text">
                    <span className="branch-card__name">{p.branch.name}</span>
                    <span className="branch-card__goal">{p.branch.goal}</span>
                  </span>
                  <span className="branch-card__percent num" style={{ color: pillar.color }}>
                    {p.percent}%
                  </span>
                  <ChevronRight size={18} strokeWidth={2} className="branch-card__chevron" aria-hidden />
                  <span className="branch-card__bar">
                    <ProgressBar
                      value={p.percent}
                      color={pillar.color}
                      label={`Cumplimiento de ${p.branch.name}`}
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </Screen>
  )
}
