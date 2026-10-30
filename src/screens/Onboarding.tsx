import { useState } from 'react'
import { ChevronRight, MoveRight, User } from 'lucide-react'
import { Screen } from '../components/Screen'
import { Sheet } from '../components/Sheet'
import { Index } from '../components/Index'
import { Button, Field, Segmented, TextField } from '../components/ui'
import { PILLARS, PILLAR_ORDER } from '../app/pillars'
import { useStore } from '../app/store'
import type { Branch, PillarKey } from '../app/types'

const DURATIONS = [8, 12, 16, 24]

const INITIAL: Branch[] = [
  { id: 'b1', pillar: 'cuerpo', name: 'Cuerpo', goal: PILLARS.cuerpo.defaultGoal },
  { id: 'b2', pillar: 'relaciones', name: 'Relaciones', goal: PILLARS.relaciones.defaultGoal },
  { id: 'b3', pillar: 'proyecto', name: 'Proyecto', goal: PILLARS.proyecto.defaultGoal },
]

export function Onboarding({ onCreated }: { onCreated: () => void }) {
  const { dispatch, loadDemo } = useStore()
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('Libertad individual')
  const [purposeDetail, setPurposeDetail] = useState('Ser lo más yo mismo, todo el tiempo posible.')
  const [weeks, setWeeks] = useState(12)
  const [branches, setBranches] = useState<Branch[]>(INITIAL)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [purposeOpen, setPurposeOpen] = useState(false)

  const ready = name.trim().length > 0 && purpose.trim().length > 0

  const create = () => {
    dispatch({
      type: 'create-season',
      name: name.trim(),
      purpose: purpose.trim(),
      purposeDetail: purposeDetail.trim(),
      weeks,
      branches,
    })
    onCreated()
  }

  return (
    <Screen>
      <h1 className="hero-title">Define tu temporada</h1>

      <div className="who">
        <User size={17} strokeWidth={2} aria-hidden />
        <input
          className="who__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          aria-label="Tu nombre"
          autoComplete="given-name"
          maxLength={24}
        />
      </div>

      <section className="stack">
        <button type="button" className="purpose-card" onClick={() => setPurposeOpen(true)}>
          <Index n={1} label="Objetivo de temporada" />
          <span className="purpose-card__text">
            <span className="purpose-card__title">{purpose || 'Sin definir'}</span>
            <span className="purpose-card__detail">{purposeDetail}</span>
          </span>
          <ChevronRight size={18} strokeWidth={2} className="purpose-card__chevron" aria-hidden />
        </button>
      </section>

      <section className="stack">
        <ul className="branch-list">
          {branches.map((branch, i) => (
            <li key={branch.id}>
              <button type="button" className="branch-row" onClick={() => setEditing(branch)}>
                <span className="branch-row__index">
                  <Index n={i + 2} label="Rama" />
                </span>
                <span className="branch-row__text">
                  <span className="branch-row__goal">{branch.goal}</span>
                  <span className="branch-row__name">{branch.name}</span>
                </span>
                <ChevronRight size={16} strokeWidth={2} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="stack">
        <p className="overline">05 · Duración de la temporada</p>
        <Segmented
          label="Duración de la temporada"
          size="sm"
          value={String(weeks)}
          onChange={(value) => setWeeks(Number(value))}
          options={DURATIONS.map((d) => ({ value: String(d), label: `${d} semanas` }))}
        />
      </section>

      <div className="stack stack--tight onboarding__actions">
        <Button full onClick={create} disabled={!ready} icon={<MoveRight size={18} aria-hidden />}>
          Crear sistema
        </Button>
        {!ready ? (
          <p className="hint">Escribe tu nombre y un objetivo para empezar.</p>
        ) : (
          <p className="hint">
            {weeks} semanas · {branches.length * weeks * 4} movimientos preparados.
          </p>
        )}
        <button type="button" className="link" onClick={loadDemo}>
          Ver una temporada de ejemplo
        </button>
      </div>

      <Sheet
        open={purposeOpen}
        title="Objetivo de temporada"
        subtitle="Una frase que valga para decidir cuando dudes."
        onClose={() => setPurposeOpen(false)}
        footer={
          <Button full onClick={() => setPurposeOpen(false)}>
            Guardar
          </Button>
        }
      >
        <div className="stack">
          <Field
            label="Objetivo"
            value={purpose}
            maxLength={40}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Libertad individual"
          />
          <TextField
            label="Qué significa para ti"
            value={purposeDetail}
            maxLength={120}
            onChange={(e) => setPurposeDetail(e.target.value)}
          />
        </div>
      </Sheet>

      {editing ? (
        <BranchEditor
          branch={editing}
          taken={branches.filter((b) => b.id !== editing.id).map((b) => b.pillar)}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setBranches((list) => list.map((b) => (b.id === next.id ? next : b)))
            setEditing(null)
          }}
        />
      ) : null}
    </Screen>
  )
}

export function BranchEditor({
  branch,
  taken,
  onClose,
  onSave,
}: {
  branch: Branch
  taken: PillarKey[]
  onClose: () => void
  onSave: (branch: Branch) => void
}) {
  const [draft, setDraft] = useState<Branch>(branch)

  const pick = (pillar: PillarKey) => {
    const p = PILLARS[pillar]
    const untouched = draft.goal === PILLARS[draft.pillar].defaultGoal
    setDraft({
      ...draft,
      pillar,
      name: p.name,
      goal: untouched ? p.defaultGoal : draft.goal,
    })
  }

  return (
    <Sheet
      open
      title="Rama"
      subtitle="El área y la meta concreta que la mide."
      onClose={onClose}
      footer={
        <Button full onClick={() => onSave(draft)} disabled={draft.goal.trim().length === 0}>
          Guardar rama
        </Button>
      }
    >
      <div className="stack">
        <div className="stack stack--tight">
          <p className="overline">Área</p>
          <ul className="pillar-picker">
            {PILLAR_ORDER.map((key) => {
              const pillar = PILLARS[key]
              const disabled = taken.includes(key)
              const active = draft.pillar === key
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={`pillar-chip ${active ? 'is-active' : ''}`}
                    disabled={disabled}
                    aria-pressed={active}
                    onClick={() => pick(key)}
                  >
                    {pillar.name}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="hint">{PILLARS[draft.pillar].blurb}</p>
        </div>

        <Field
          label="Nombre de la rama"
          value={draft.name}
          maxLength={18}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          hint="Puedes llamarla como la llamas tú: “Derwatt”, “Cuerpo”, “Dinero”."
        />

        <TextField
          label="Meta de la rama"
          value={draft.goal}
          maxLength={120}
          onChange={(e) => setDraft({ ...draft, goal: e.target.value })}
          hint="Concreta y comprobable. Sabrás si la has cumplido."
        />
      </div>
    </Sheet>
  )
}
