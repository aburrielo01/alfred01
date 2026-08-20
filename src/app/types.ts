export type PillarKey = 'cuerpo' | 'relaciones' | 'proyecto' | 'mente' | 'finanzas'

export type Difficulty = 'baja' | 'media' | 'alta'

export type MoveStatus = 'pendiente' | 'hecho' | 'saltado'

export interface Branch {
  id: string
  pillar: PillarKey
  name: string
  goal: string
}

export interface Movement {
  id: string
  branchId: string
  week: number
  order: number
  title: string
  intent: string
  steps: string[]
  minutes: number
  difficulty: Difficulty
  status: MoveStatus
  resolvedAt?: string
  note?: string
}

export interface Season {
  purpose: string
  purposeDetail: string
  weeks: number
  startedAt: string
  branches: Branch[]
}

export interface Accountability {
  mode: 'amigo' | 'coach'
  partner: string
  lastSentAt?: string
  lastValidationAt?: string
  requestedAt?: string
}

export interface AppState {
  version: number
  name: string
  season: Season | null
  movements: Movement[]
  accountability: Accountability
}

export interface BranchProgress {
  branch: Branch
  done: number
  total: number
  percent: number
  weekPoints: number
  prevWeekPoints: number
  delta: number
  pendingThisWeek: number
}
