/**
 * El índice de un bloque. El número no decora: dice en qué orden mira el
 * sistema cada cosa, y es lo que distingue a las ramas entre sí ahora que
 * ninguna tiene color propio.
 */
export function Index({
  n,
  label,
  alert = false,
}: {
  n: number
  label?: string
  alert?: boolean
}) {
  const number = String(n).padStart(2, '0')
  return (
    <p className="index">
      {number}
      {label ? ` · ${label}` : ''}
      {alert ? <span className="dot-alert" style={{ display: 'inline-block', marginLeft: 8, verticalAlign: 'middle' }} /> : null}
    </p>
  )
}
