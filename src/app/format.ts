import { daysBetween } from './engine'

export function relativeDays(iso: string | undefined, now = new Date()): string | null {
  if (!iso) return null
  const days = daysBetween(new Date(iso), now)
  if (days <= 0) return 'hoy'
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  if (days < 14) return 'hace una semana'
  if (days < 60) return `hace ${Math.round(days / 7)} semanas`
  return `hace ${Math.round(days / 30)} meses`
}

export function signed(value: number): string {
  return value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : '0'
}
