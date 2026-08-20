import { useEffect, useState } from 'react'
import { Check, Clock, RotateCcw, SignalHigh } from 'lucide-react'
import { Sheet } from './Sheet'
import { Button, TextField } from './ui'
import { PILLARS } from '../app/pillars'
import { plannedDayName } from '../app/engine'
import type { Branch, Movement } from '../app/types'

interface Props {
  movement: Movement | null
  branch: Branch | undefined
  onClose: () => void
  onResolve: (id: string, status: 'hecho' | 'saltado', note?: string) => void
  onReopen: (id: string) => void
}

export function MovementSheet({ movement, branch, onClose, onResolve, onReopen }: Props) {
  const [askingWhy, setAskingWhy] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    setAskingWhy(false)
    setNote('')
  }, [movement?.id])

  if (!movement || !branch) return null
  const tone = PILLARS[branch.pillar].color
  const resolved = movement.status !== 'pendiente'

  return (
    <Sheet
      open
      title={movement.title}
      subtitle={`${branch.name} · semana ${movement.week} · planeado para el ${plannedDayName(movement)}`}
      onClose={onClose}
      footer={
        resolved ? (
          <Button variant="secondary" full icon={<RotateCcw size={17} aria-hidden />} onClick={() => onReopen(movement.id)}>
            Volver a dejarlo pendiente
          </Button>
        ) : askingWhy ? (
          <div className="stack stack--tight">
            <TextField
              label="¿Qué se interpuso?"
              hint="Queda en tu revisión semanal. Nadie más lo lee."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Se cruzó con el trabajo…"
            />
            <div className="row row--split">
              <Button variant="ghost" onClick={() => setAskingWhy(false)}>
                Cancelar
              </Button>
              <Button variant="secondary" onClick={() => onResolve(movement.id, 'saltado', note.trim() || undefined)}>
                Guardar y saltar
              </Button>
            </div>
          </div>
        ) : (
          <div className="stack stack--tight">
            <Button full icon={<Check size={18} strokeWidth={2.4} aria-hidden />} onClick={() => onResolve(movement.id, 'hecho')}>
              Hecho
            </Button>
            <Button variant="ghost" full onClick={() => setAskingWhy(true)}>
              Ahora no
            </Button>
          </div>
        )
      }
    >
      <p className="move-detail__intent" style={{ color: tone }}>
        {movement.intent}
      </p>

      <div className="meta-row">
        <span className="meta">
          <Clock size={15} strokeWidth={2} aria-hidden />
          {movement.minutes} min
        </span>
        <span className="meta">
          <SignalHigh size={15} strokeWidth={2} aria-hidden />
          Dificultad {movement.difficulty}
        </span>
      </div>

      <ol className="steps">
        {movement.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      {movement.note ? <p className="move-detail__note">Nota: {movement.note}</p> : null}
    </Sheet>
  )
}
