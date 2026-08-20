import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Info,
  Minus,
  Send,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { Screen } from '../components/Screen'
import { Sheet } from '../components/Sheet'
import { WeekChart } from '../components/WeekChart'
import { BranchBadge } from '../components/BranchIcon'
import { Button, Field, Segmented, useToast } from '../components/ui'
import { PILLARS } from '../app/pillars'
import {
  branchProgress,
  currentWeek,
  reviewSummary,
  weekCurve,
  weekPerformance,
} from '../app/engine'
import { relativeDays, signed } from '../app/format'
import { useStore } from '../app/store'

export function Review({ onPulse }: { onPulse: () => void }) {
  const { state, dispatch } = useStore()
  const { notify } = useToast()
  const [explaining, setExplaining] = useState(false)
  const [sending, setSending] = useState(false)
  const [asking, setAsking] = useState(false)
  const [partner, setPartner] = useState(state.accountability.partner)

  const season = state.season
  if (!season) return null

  const progress = branchProgress(state)
  const curve = weekCurve(state)
  const performance = weekPerformance(state)
  const summary = reviewSummary(state)
  const validated = relativeDays(state.accountability.lastValidationAt)
  const requested = relativeDays(state.accountability.requestedAt)
  const sent = relativeDays(state.accountability.lastSentAt)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      notify('Revisión copiada')
    } catch {
      notify('Selecciona el texto para copiarlo')
    }
  }

  const send = async () => {
    dispatch({ type: 'accountability', patch: { lastSentAt: new Date().toISOString() } })
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Revisión semanal', text: summary })
        setSending(false)
        notify('Revisión enviada')
        return
      } catch {
        /* el usuario canceló: se queda la hoja abierta para copiar */
      }
    }
    await copy()
    setSending(false)
  }

  return (
    <Screen title="Revisión" subtitle="Tu semana, en perspectiva." onPulse={onPulse}>
      <section className="week-card">
        <div className="week-card__head">
          <div>
            <p className="week-card__label">Visión semanal</p>
            <p className="week-card__value num">
              {performance}
              <span>%</span>
            </p>
            <button type="button" className="week-card__info" onClick={() => setExplaining(true)}>
              Rendimiento total
              <Info size={14} strokeWidth={2} aria-hidden />
            </button>
          </div>
          <p className="week-card__week num">
            Semana {currentWeek(season)} de {season.weeks}
          </p>
        </div>
        <WeekChart
          curve={curve}
          caption={`Cumplimiento acumulado de la semana: ${performance}% al día de hoy.`}
        />
      </section>

      <ul className="score-row">
        {progress.map((p) => {
          const pillar = PILLARS[p.branch.pillar]
          const trend = p.delta > 0 ? 'up' : p.delta < 0 ? 'down' : 'flat'
          return (
            <li
              key={p.branch.id}
              className="score"
              style={{ '--tone': pillar.color } as React.CSSProperties}
            >
              <BranchBadge pillar={p.branch.pillar} color={pillar.color} size={38} />
              <p className="score__name">{p.branch.name}</p>
              <p className="score__value num" style={{ color: pillar.color }}>
                {p.weekPoints}
              </p>
              <p className="score__unit">puntos</p>
              <p className={`score__delta num is-${trend}`}>
                {trend === 'up' ? <ArrowUp size={13} strokeWidth={2.4} aria-hidden /> : null}
                {trend === 'down' ? <ArrowDown size={13} strokeWidth={2.4} aria-hidden /> : null}
                {trend === 'flat' ? <Minus size={13} strokeWidth={2.4} aria-hidden /> : null}
                {signed(p.delta)} <span>vs. la semana pasada</span>
              </p>
            </li>
          )
        })}
      </ul>

      <section className="accountability">
        <h2 className="accountability__title">Validado por amigo o coach</h2>

        <Segmented
          label="Quién valida tu revisión"
          value={state.accountability.mode}
          onChange={(mode) => dispatch({ type: 'accountability', patch: { mode } })}
          options={[
            { value: 'amigo', label: 'Amigo', icon: <Users size={16} strokeWidth={2} aria-hidden /> },
            {
              value: 'coach',
              label: 'Coach',
              icon: <ShieldCheck size={16} strokeWidth={2} aria-hidden />,
            },
          ]}
        />

        <p className="accountability__note">
          {state.accountability.partner
            ? `Tu ${state.accountability.mode} es ${state.accountability.partner}.`
            : 'Elige quién validará tu revisión semanal.'}
        </p>

        {validated ? (
          <p className="accountability__stamp num">
            <ShieldCheck size={14} strokeWidth={2} aria-hidden />
            Última validación: <b>{validated}</b>
          </p>
        ) : null}

        <div className="stack stack--tight">
          <Button full icon={<Send size={17} strokeWidth={2} aria-hidden />} onClick={() => setSending(true)}>
            Enviar revisión
          </Button>
          <Button
            variant="secondary"
            full
            icon={<UserPlus size={17} strokeWidth={2} aria-hidden />}
            onClick={() => setAsking(true)}
          >
            Solicitar validación
          </Button>
        </div>

        {requested ? <p className="hint">Validación solicitada {requested}.</p> : null}
        {sent ? <p className="hint">Última revisión enviada {sent}.</p> : null}

        <p className="accountability__foot">
          <ShieldCheck size={15} strokeWidth={2} aria-hidden />
          Contarlo en voz alta te obliga a mirar los números de verdad, no los que recuerdas.
        </p>
      </section>

      <Sheet
        open={explaining}
        title="Cómo se calcula"
        subtitle="Nada de esto es una nota. Es fidelidad al plan."
        onClose={() => setExplaining(false)}
      >
        <div className="prose">
          <p>
            Cada movimiento vale puntos según su dificultad: 8 los suaves, 12 los medios y 18 los
            duros. El <b>rendimiento semanal</b> son los puntos que llevas confirmados esta semana
            frente a los que tu plan te pedía.
          </p>
          <p>
            El <b>cumplimiento</b> de cada rama compara lo hecho con lo que el sistema te ha pedido
            hasta hoy, no con el final de la temporada. Por eso puede subir aunque queden semanas.
          </p>
          <p>
            Saltar un movimiento no resta puntos: solo deja de sumarlos, y guarda tu motivo para la
            revisión.
          </p>
        </div>
      </Sheet>

      <Sheet
        open={sending}
        title="Revisión de la semana"
        subtitle="Esto es lo que va a leer quien te valida."
        onClose={() => setSending(false)}
        footer={
          <div className="stack stack--tight">
            <Button full icon={<Send size={17} strokeWidth={2} aria-hidden />} onClick={send}>
              Enviar
            </Button>
            <Button variant="ghost" full icon={<Copy size={16} strokeWidth={2} aria-hidden />} onClick={copy}>
              Copiar texto
            </Button>
          </div>
        }
      >
        <pre className="summary num">{summary}</pre>
      </Sheet>

      <Sheet
        open={asking}
        title="Solicitar validación"
        subtitle="Una persona basta. La que no te deje escaquearte."
        onClose={() => setAsking(false)}
        footer={
          <Button
            full
            disabled={partner.trim().length === 0}
            onClick={() => {
              dispatch({
                type: 'accountability',
                patch: { partner: partner.trim(), requestedAt: new Date().toISOString() },
              })
              setAsking(false)
              notify('Solicitud registrada')
            }}
          >
            Registrar solicitud
          </Button>
        }
      >
        <div className="stack">
          <Field
            label={`Nombre de tu ${state.accountability.mode}`}
            value={partner}
            maxLength={24}
            onChange={(e) => setPartner(e.target.value)}
            placeholder="Marcos"
          />
          <p className="hint">
            Alfred guarda la solicitud y la fecha. El aviso se lo das tú: envíale la revisión desde
            el botón de arriba.
          </p>
        </div>
      </Sheet>
    </Screen>
  )
}
