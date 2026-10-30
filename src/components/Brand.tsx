import { FIRMA, FIRMA_TRAZO, ICONO } from '../brand/marks'

/**
 * La firma. Hereda el color de su contenedor: en las cabeceras va en tinta,
 * porque en este sistema el rojo está reservado para lo que reclama atención.
 */
export function BrandSign({ trazo = false, className = '' }: { trazo?: boolean; className?: string }) {
  return (
    <span
      className={`brand-sign ${className}`}
      role="img"
      aria-label="Alfred"
      dangerouslySetInnerHTML={{ __html: trazo ? FIRMA_TRAZO : FIRMA }}
    />
  )
}

export function BrandIcon({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-icon ${className}`} aria-hidden dangerouslySetInnerHTML={{ __html: ICONO }} />
  )
}
