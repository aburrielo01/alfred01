/**
 * Esfera de marca. Geometría pura en CSS: es el único elemento decorativo
 * del sistema y solo aparece en las tarjetas que abren una pantalla.
 */
export function Orb({ size = 200, tone = 'var(--tint)' }: { size?: number; tone?: string }) {
  return (
    <span
      className="orb"
      aria-hidden
      style={{ '--orb-size': `${size}px`, '--orb-tone': tone } as React.CSSProperties}
    />
  )
}
