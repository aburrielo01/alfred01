import type { DayPoint } from '../app/engine'

const W = 320
const H = 132
const PAD_X = 6
const PAD_TOP = 8
const PAD_BOTTOM = 6

function pointsToPath(values: { x: number; y: number }[]): string {
  if (values.length === 0) return ''
  if (values.length === 1) return `M ${values[0].x} ${values[0].y}`

  let d = `M ${values[0].x} ${values[0].y}`
  for (let i = 0; i < values.length - 1; i += 1) {
    const p0 = values[Math.max(0, i - 1)]
    const p1 = values[i]
    const p2 = values[i + 1]
    const p3 = values[Math.min(values.length - 1, i + 2)]
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x} ${p2.y.toFixed(2)}`
  }
  return d
}

/**
 * Curva acumulada de la semana. La línea termina en hoy: los días que no han
 * ocurrido no se dibujan planos, se dejan vacíos.
 */
export function WeekChart({ curve, caption }: { curve: DayPoint[]; caption: string }) {
  const plotH = H - PAD_TOP - PAD_BOTTOM
  const step = (W - PAD_X * 2) / 6

  const coords = curve
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => !d.isFuture)
    .map(({ d, i }) => ({
      x: PAD_X + i * step,
      y: PAD_TOP + plotH - (d.value / 100) * plotH,
    }))
  const line = pointsToPath(coords)
  const last = coords[coords.length - 1]

  return (
    <figure className="chart">
      <svg
        className="chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={caption}
      >
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = PAD_TOP + plotH - (tick / 100) * plotH
          return (
            <line
              key={tick}
              x1={PAD_X}
              x2={W - PAD_X}
              y1={y}
              y2={y}
              stroke="var(--line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          )
        })}

        {line ? (
          <path
            d={line}
            fill="none"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
        {last ? (
          <circle cx={last.x} cy={last.y} r="4.5" fill="var(--live)" vectorEffect="non-scaling-stroke" />
        ) : null}
      </svg>

      <div className="chart__scale num" aria-hidden>
        {[100, 75, 50, 25, 0].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>

      <figcaption className="chart__days">
        {curve.map((d) => (
          <span key={d.label} className={d.isToday ? 'is-today' : d.isFuture ? 'is-future' : ''}>
            {d.label}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
