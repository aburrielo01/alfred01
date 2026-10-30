import { useRef, useState, type ReactNode } from 'react'
import { ChevronRight, Download, Sparkles, Trash2, Upload } from 'lucide-react'
import { Screen } from '../components/Screen'
import { Sheet } from '../components/Sheet'
import { BranchEditor } from './Onboarding'
import { Index } from '../components/Index'
import { Pct } from '../components/Pct'
import { Button, Field, useToast } from '../components/ui'
import { branchProgress, currentWeek, daysLeft, seasonPercent, streak } from '../app/engine'
import { useStore } from '../app/store'
import { saveFile } from '../app/host'
import type { AppState, Branch } from '../app/types'

export function Profile({ onPulse, onReset }: { onPulse: () => void; onReset: () => void }) {
  const { state, dispatch, loadDemo } = useStore()
  const { notify } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [confirming, setConfirming] = useState(false)

  const season = state.season
  if (!season) return null

  const progress = branchProgress(state)

  const exportData = async () => {
    const name = `alfred-${new Date().toISOString().slice(0, 10)}.json`
    const outcome = await saveFile(name, JSON.stringify(state, null, 2))
    notify(outcome === 'guardado' ? 'Copia descargada' : 'Copia sin guardar')
  }

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as AppState
      if (!parsed || !Array.isArray(parsed.movements)) throw new Error('formato')
      dispatch({ type: 'replace', state: parsed })
      notify('Sistema restaurado')
    } catch {
      notify('Ese archivo no es una copia de Alfred')
    }
  }

  const facts: { label: string; value: ReactNode }[] = [
    { label: 'Objetivo', value: season.purpose },
    { label: 'Semana', value: `${currentWeek(season)} de ${season.weeks}` },
    { label: 'Cumplimiento', value: <Pct value={seasonPercent(progress)} /> },
    { label: 'Racha', value: `${streak(state)} días` },
    { label: 'Quedan', value: `${daysLeft(season)} días` },
  ]

  return (
    <Screen title="Perfil" subtitle="Tú y tus datos" onPulse={onPulse}>
      <section className="stack stack--tight">
        <Field
          label="Tu nombre"
          value={state.name}
          maxLength={24}
          onChange={(e) => dispatch({ type: 'set-name', name: e.target.value })}
        />
      </section>

      <section className="stack stack--tight">
        <p className="overline">01 · Temporada</p>
        <dl className="facts">
          {facts.map((fact) => (
            <div key={fact.label} className="facts__row">
              <dt>{fact.label}</dt>
              <dd className="num">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="stack stack--tight">
        <p className="overline">02 · Ramas</p>
        <ul className="branch-list">
          {season.branches.map((branch, i) => (
            <li key={branch.id}>
              <button type="button" className="branch-row" onClick={() => setEditing(branch)}>
                <span className="branch-row__index">
                  <Index n={i + 2} label="Rama" />
                </span>
                <span className="branch-row__text">
                  <span className="branch-row__goal">{branch.name}</span>
                  <span className="branch-row__name">{branch.goal}</span>
                </span>
                <ChevronRight size={16} strokeWidth={2} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="stack stack--tight">
        <p className="overline">06 · Tus datos</p>
        <p className="hint">
          Todo vive en este dispositivo, en el almacenamiento del navegador. No hay cuenta ni
          servidor: la copia manual es tu respaldo.
        </p>
        <div className="stack stack--tight">
          <Button
            variant="secondary"
            full
            icon={<Download size={16} strokeWidth={2} aria-hidden />}
            onClick={() => void exportData()}
          >
            Descargar copia
          </Button>
          <Button
            variant="secondary"
            full
            icon={<Upload size={16} strokeWidth={2} aria-hidden />}
            onClick={() => fileInput.current?.click()}
          >
            Restaurar copia
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="visually-hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void importData(file)
              e.target.value = ''
            }}
          />
          <Button
            variant="ghost"
            full
            icon={<Sparkles size={16} strokeWidth={2} aria-hidden />}
            onClick={() => {
              loadDemo()
              notify('Temporada de ejemplo cargada')
            }}
          >
            Cargar temporada de ejemplo
          </Button>
          <Button
            variant="danger"
            full
            icon={<Trash2 size={16} strokeWidth={2} aria-hidden />}
            onClick={() => setConfirming(true)}
          >
            Empezar una temporada nueva
          </Button>
        </div>
      </section>

      <p className="colophon">
        Alfred · prototipo funcional
        <br />
        Un objetivo, tres ramas, un movimiento cada vez.
      </p>

      {editing ? (
        <BranchEditor
          branch={editing}
          taken={season.branches.filter((b) => b.id !== editing.id).map((b) => b.pillar)}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            dispatch({
              type: 'update-branch',
              id: next.id,
              patch: { name: next.name, goal: next.goal, pillar: next.pillar },
            })
            setEditing(null)
          }}
        />
      ) : null}

      <Sheet
        open={confirming}
        title="Empezar de cero"
        subtitle="Se borra la temporada actual y todo lo que llevas confirmado."
        onClose={() => setConfirming(false)}
        footer={
          <div className="stack stack--tight">
            <Button
              variant="danger"
              full
              onClick={() => {
                setConfirming(false)
                dispatch({ type: 'reset' })
                onReset()
              }}
            >
              Sí, borrar y empezar
            </Button>
            <Button variant="ghost" full onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
          </div>
        }
      >
        <div className="prose">
          <p>
            Esta acción no se puede deshacer. Si quieres conservar el histórico, descarga antes una
            copia desde “Descargar copia”.
          </p>
        </div>
      </Sheet>
    </Screen>
  )
}
