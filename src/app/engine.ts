import { DIFFICULTY_POINTS, PILLARS } from './pillars'
import type { AppState, Branch, BranchProgress, Movement, Season } from './types'

export const MOVES_PER_WEEK = 4
const DAY = 24 * 60 * 60 * 1000

/* Dates ------------------------------------------------------------------ */

export function startOfDay(d: Date): Date {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

/** Monday-first weekday index, 0 = lunes. */
export function weekdayIndex(d: Date): number {
  return (d.getDay() + 6) % 7
}

export function startOfWeek(d: Date): Date {
  const c = startOfDay(d)
  c.setDate(c.getDate() - weekdayIndex(c))
  return c
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY)
}

export function currentWeek(season: Season, now = new Date()): number {
  const elapsed = daysBetween(new Date(season.startedAt), now)
  return Math.min(season.weeks, Math.max(1, Math.floor(elapsed / 7) + 1))
}

export function daysLeft(season: Season, now = new Date()): number {
  const end = new Date(season.startedAt)
  end.setDate(end.getDate() + season.weeks * 7)
  return Math.max(0, daysBetween(now, end))
}

/* Plan ------------------------------------------------------------------- */

export function pointsOf(m: Movement): number {
  return DIFFICULTY_POINTS[m.difficulty]
}

export function buildPlan(branches: Branch[], weeks: number): Movement[] {
  const plan: Movement[] = []
  for (const branch of branches) {
    const templates = PILLARS[branch.pillar].templates
    for (let week = 1; week <= weeks; week += 1) {
      for (let order = 0; order < MOVES_PER_WEEK; order += 1) {
        const t = templates[((week - 1) * MOVES_PER_WEEK + order) % templates.length]
        plan.push({
          id: `${branch.id}-w${week}-${order}`,
          branchId: branch.id,
          week,
          order,
          title: t.title,
          intent: t.intent,
          steps: t.steps,
          minutes: t.minutes,
          difficulty: t.difficulty,
          status: 'pendiente',
        })
      }
    }
  }
  return plan
}

/* Progress --------------------------------------------------------------- */

function sumPoints(moves: Movement[]): number {
  return moves.reduce((total, m) => total + pointsOf(m), 0)
}

function pointsInWeek(moves: Movement[], week: number): number {
  return sumPoints(moves.filter((m) => m.status === 'hecho' && m.week === week))
}

/** Para comparar semanas a mitad de semana: mismo tramo, mismo rasero. */
function pointsInWeekUntil(moves: Movement[], week: number, day: number): number {
  return sumPoints(
    moves.filter((m) => m.status === 'hecho' && m.week === week && plannedWeekday(m) <= day),
  )
}

/**
 * Cumplimiento: puntos hechos frente a los que el sistema ha pedido hasta hoy.
 * Mide fidelidad al plan, no distancia al objetivo final.
 */
export function branchProgress(state: AppState, now = new Date()): BranchProgress[] {
  const season = state.season
  if (!season) return []
  const week = currentWeek(season, now)

  return season.branches.map((branch) => {
    const moves = state.movements.filter((m) => m.branchId === branch.id)
    const scheduled = moves.filter((m) => m.week <= week)
    const done = scheduled.filter((m) => m.status === 'hecho')
    const total = sumPoints(scheduled)
    const earned = sumPoints(done)
    const weekPoints = pointsInWeek(moves, week)
    const today = weekdayIndex(now)
    const prevWeekPoints = week > 1 ? pointsInWeekUntil(moves, week - 1, today) : 0

    return {
      branch,
      done: done.length,
      total: scheduled.length,
      percent: total === 0 ? 0 : Math.round((earned / total) * 100),
      weekPoints,
      prevWeekPoints,
      delta: weekPoints - prevWeekPoints,
      pendingThisWeek: moves.filter((m) => m.week === week && m.status === 'pendiente').length,
    }
  })
}

export function seasonPercent(progress: BranchProgress[]): number {
  if (progress.length === 0) return 0
  const sum = progress.reduce((total, p) => total + p.percent, 0)
  return Math.round(sum / progress.length)
}

export function weakestBranch(progress: BranchProgress[]): BranchProgress | null {
  if (progress.length === 0) return null
  return progress.reduce((min, p) => (p.percent < min.percent ? p : min), progress[0])
}

/**
 * Un solo movimiento a la vez: el de la rama más descuidada, en el orden
 * en que el sistema lo planteó. Si la semana está cerrada, mira la siguiente.
 */
export function nextMovement(state: AppState, now = new Date()): Movement | null {
  const season = state.season
  if (!season) return null
  const week = currentWeek(season, now)
  const progress = branchProgress(state, now)
  const rank = new Map(progress.map((p) => [p.branch.id, p.percent]))

  for (let w = week; w <= season.weeks; w += 1) {
    const pending = state.movements
      .filter((m) => m.week === w && m.status === 'pendiente')
      .sort((a, b) => {
        const byBranch = (rank.get(a.branchId) ?? 0) - (rank.get(b.branchId) ?? 0)
        return byBranch !== 0 ? byBranch : a.order - b.order
      })
    if (pending.length > 0) return pending[0]
  }
  return null
}

export function movementsOfBranch(
  state: AppState,
  branchId: string,
  week: number,
): Movement[] {
  return state.movements
    .filter((m) => m.branchId === branchId && m.week === week)
    .sort((a, b) => a.order - b.order)
}

/* Semana ------------------------------------------------------------------ */

export const DAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
export const DAY_NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']

/** El plan tiene ritmo: cada movimiento de la semana cae en un día fijo. */
const PLANNED_WEEKDAY = [0, 1, 3, 5]

export function plannedWeekday(movement: Movement): number {
  return PLANNED_WEEKDAY[movement.order % PLANNED_WEEKDAY.length]
}

export function plannedDayName(movement: Movement): string {
  return DAY_NAMES[plannedWeekday(movement)]
}

export interface DayPoint {
  label: string
  value: number
  /** El día no cuenta todavía: no ha llegado, o el plan aún no pedía nada. */
  isFuture: boolean
  isToday: boolean
}

/**
 * Cumplimiento acumulado de la semana: al cerrar cada día, qué parte de lo que
 * el plan pedía hasta ese día está confirmada. Los días que aún no han llegado
 * no se dibujan.
 */
export function weekCurve(state: AppState, now = new Date()): DayPoint[] {
  const season = state.season
  if (!season) return []
  const week = currentWeek(season, now)
  const monday = startOfWeek(now)
  const today = weekdayIndex(now)
  const ofWeek = state.movements.filter((m) => m.week === week)

  // Una temporada que empieza a media semana no arrastra los días anteriores.
  const graceFrom = week === 1 ? weekdayIndex(new Date(season.startedAt)) : 0

  const earnedOn = new Array(7).fill(0)
  for (const m of state.movements) {
    if (m.status !== 'hecho' || !m.resolvedAt) continue
    const index = daysBetween(monday, new Date(m.resolvedAt))
    if (index >= 0 && index < 7) earnedOn[index] += pointsOf(m)
  }

  const askedOn = new Array(7).fill(0)
  for (const m of ofWeek) {
    const day = plannedWeekday(m)
    if (day >= graceFrom) askedOn[day] += pointsOf(m)
  }

  let earned = 0
  let asked = 0
  return DAY_LABELS.map((label, i) => {
    earned += earnedOn[i]
    asked += askedOn[i]
    return {
      label,
      value: asked === 0 ? 0 : Math.min(100, Math.round((earned / asked) * 100)),
      isFuture: i > today || asked === 0,
      isToday: i === today,
    }
  })
}

export function weekPerformance(state: AppState, now = new Date()): number {
  const curve = weekCurve(state, now)
  const today = weekdayIndex(now)
  return curve[today]?.value ?? 0
}

/**
 * Racha: días consecutivos, hacia atrás, en los que todo lo que el plan pedía
 * quedó confirmado. Un día sin nada planeado no rompe la racha ni la suma.
 */
export function streak(state: AppState, now = new Date()): number {
  const season = state.season
  if (!season) return 0
  const start = new Date(season.startedAt)

  const plannedFor = (date: Date): Movement[] => {
    const elapsed = daysBetween(start, date)
    if (elapsed < 0) return []
    const week = Math.floor(elapsed / 7) + 1
    if (week > season.weeks) return []
    const day = weekdayIndex(date)
    return state.movements.filter((m) => m.week === week && plannedWeekday(m) === day)
  }

  const allDone = (moves: Movement[]) => moves.every((m) => m.status === 'hecho')

  const cursor = startOfDay(now)
  // El día en curso solo cuenta si ya está cerrado; si no, se empieza por ayer.
  const todayMoves = plannedFor(cursor)
  if (todayMoves.length === 0 || !allDone(todayMoves)) cursor.setDate(cursor.getDate() - 1)

  let count = 0
  for (let guard = 0; guard < 400; guard += 1) {
    if (daysBetween(start, cursor) < 0) break
    const moves = plannedFor(cursor)
    if (moves.length > 0) {
      if (!allDone(moves)) break
      count += 1
    }
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

/* Texto ------------------------------------------------------------------- */

export function greeting(now = new Date()): string {
  const h = now.getHours()
  if (h < 6) return 'Aún despierto'
  if (h < 13) return 'Buenos días'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export function reviewSummary(state: AppState, now = new Date()): string {
  const season = state.season
  if (!season) return ''
  const progress = branchProgress(state, now)
  const lines = [
    `Alfred · Revisión semanal de ${state.name}`,
    `Temporada: ${season.purpose} — semana ${currentWeek(season, now)} de ${season.weeks}`,
    `Rendimiento de la semana: ${weekPerformance(state, now)}%`,
    '',
  ]
  for (const p of progress) {
    const sign = p.delta >= 0 ? '+' : '−'
    lines.push(
      `${p.branch.name}: ${p.weekPoints} puntos (${sign}${Math.abs(p.delta)} vs. semana pasada) · cumplimiento ${p.percent}%`,
    )
    lines.push(`  Objetivo: ${p.branch.goal}`)
  }
  const weak = weakestBranch(progress)
  if (weak) {
    lines.push('', `Área más descuidada: ${weak.branch.name}.`)
  }
  lines.push('', `Racha: ${streak(state, now)} días de plan cumplidos.`)
  return lines.join('\n')
}
