import { useCallback, useState } from 'react'
import { Pct } from '../components/Pct'
import { Pencil } from 'lucide-react'
import { Screen } from '../components/Screen'
import { MovementRow } from '../components/MovementRow'
import { BranchEditor } from './Onboarding'
import { Button, ProgressBar } from '../components/ui'
import { branchProgress, currentWeek, movementsOfBranch } from '../app/engine'
import { useStore } from '../app/store'
import type { Movement } from '../app/types'

interface Props {
  branchId: string
  onBack: () => void
  backLabel: string
  onOpenMovement: (movement: Movement) => void
}

export function BranchDetail({ branchId, onBack, backLabel, onOpenMovement }: Props) {
  const { state, dispatch } = useStore()
  const season = state.season
  const branch = season?.branches.find((b) => b.id === branchId)
  const [week, setWeek] = useState(() => (season ? currentWeek(season) : 1))
  const [editing, setEditing] = useState(false)

  const centerActive = useCallback((node: HTMLButtonElement | null) => {
    node?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [])

  if (!season || !branch) return null

  const progress = branchProgress(state).find((p) => p.branch.id === branchId)
  const moves = movementsOfBranch(state, branchId, week)
  const weeks = Array.from({ length: season.weeks }, (_, i) => i + 1)
  const thisWeek = currentWeek(season)

  return (
    <Screen onBack={onBack} backLabel={backLabel}>
      <header className="branch-head">
        <h1 className="branch-head__name">{branch.name}</h1>
        <p className="branch-head__goal">{branch.goal}</p>
      </header>

      {progress ? (
        <div className="branch-head__stats">
          <p className="num"><Pct value={progress.percent} /></p>
          <p className="branch-head__stat-label num">
            {progress.done} de {progress.total} movimientos confirmados
          </p>
          <ProgressBar
            value={progress.percent}
            color="var(--ink)"
            label={`Cumplimiento de ${branch.name}`}
          />
        </div>
      ) : null}

      <nav className="weeks" aria-label="Semanas de la temporada">
        <ul>
          {weeks.map((w) => (
            <li key={w}>
              <button
                type="button"
                className={`weeks__item ${w === week ? 'is-active' : ''} ${w === thisWeek ? 'is-now' : ''}`}
                aria-current={w === week ? 'true' : undefined}
                ref={w === week ? centerActive : undefined}
                onClick={() => setWeek(w)}
              >
                <span className="num">{w}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section className="stack stack--tight">
        <div className="section-title">
          <h2 className="num">Semana {week}</h2>
          <p>
            {week === thisWeek
              ? 'La semana en curso.'
              : week < thisWeek
                ? 'Semana cerrada. Aún puedes confirmar lo que hiciste.'
                : 'Todavía no ha llegado. Puedes adelantarte.'}
          </p>
        </div>

        {moves.length === 0 ? (
          <div className="empty">
            <p className="empty__title">Sin movimientos</p>
            <p className="empty__text">Esta semana queda fuera de la temporada.</p>
          </div>
        ) : (
          <ul className="move-list">
            {moves.map((m) => (
              <MovementRow key={m.id} movement={m} onOpen={() => onOpenMovement(m)} />
            ))}
          </ul>
        )}
      </section>

      <Button
        variant="secondary"
        full
        icon={<Pencil size={16} strokeWidth={2} aria-hidden />}
        onClick={() => setEditing(true)}
      >
        Editar rama
      </Button>

      {editing ? (
        <BranchEditor
          branch={branch}
          taken={season.branches.filter((b) => b.id !== branch.id).map((b) => b.pillar)}
          onClose={() => setEditing(false)}
          onSave={(next) => {
            dispatch({
              type: 'update-branch',
              id: branch.id,
              patch: { name: next.name, goal: next.goal, pillar: next.pillar },
            })
            setEditing(false)
          }}
        />
      ) : null}
    </Screen>
  )
}
