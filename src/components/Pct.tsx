/**
 * Un porcentaje. El signo va más pequeño y algo elevado: en una matriz de
 * píxeles, a cuerpo entero, se confunde con una equis.
 */
export function Pct({ value }: { value: number }) {
  return (
    <>
      {value}
      <span className="pct">%</span>
    </>
  )
}
