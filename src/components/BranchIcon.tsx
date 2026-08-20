import { Brain, Dumbbell, Rocket, Users, Wallet } from 'lucide-react'
import type { PillarKey } from '../app/types'

const ICONS = {
  cuerpo: Dumbbell,
  relaciones: Users,
  proyecto: Rocket,
  mente: Brain,
  finanzas: Wallet,
} as const

export function BranchIcon({
  pillar,
  size = 20,
  color,
}: {
  pillar: PillarKey
  size?: number
  color?: string
}) {
  const Glyph = ICONS[pillar]
  return <Glyph size={size} strokeWidth={2} color={color} aria-hidden />
}

export function BranchBadge({
  pillar,
  color,
  size = 46,
  muted = false,
}: {
  pillar: PillarKey
  color: string
  size?: number
  muted?: boolean
}) {
  return (
    <span
      className={`branch-badge ${muted ? 'is-muted' : ''}`}
      style={{ '--badge-size': `${size}px`, '--badge-tone': color } as React.CSSProperties}
    >
      <BranchIcon pillar={pillar} size={Math.round(size * 0.44)} color={muted ? 'var(--ink-3)' : color} />
    </span>
  )
}
