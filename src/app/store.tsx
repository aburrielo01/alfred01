import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { PILLARS } from './pillars'
import { buildPlan, MOVES_PER_WEEK, startOfWeek } from './engine'
import type { AppState, Branch, Movement, PillarKey, Season } from './types'

const STORAGE_KEY = 'alfred.state.v1'
const VERSION = 1

export const EMPTY_STATE: AppState = {
  version: VERSION,
  name: '',
  season: null,
  movements: [],
  accountability: { mode: 'amigo', partner: '' },
}

/* Acciones ---------------------------------------------------------------- */

export type Action =
  | { type: 'set-name'; name: string }
  | {
      type: 'create-season'
      name: string
      purpose: string
      purposeDetail: string
      weeks: number
      branches: Branch[]
    }
  | { type: 'resolve'; id: string; status: 'hecho' | 'saltado'; note?: string }
  | { type: 'reopen'; id: string }
  | { type: 'update-branch'; id: string; patch: Partial<Branch> }
  | { type: 'update-season'; patch: Partial<Pick<Season, 'purpose' | 'purposeDetail' | 'weeks'>> }
  | { type: 'accountability'; patch: Partial<AppState['accountability']> }
  | { type: 'replace'; state: AppState }
  | { type: 'reset' }

function withPlanLength(state: AppState, weeks: number): Movement[] {
  const season = state.season
  if (!season) return state.movements
  if (weeks === season.weeks) return state.movements
  if (weeks < season.weeks) return state.movements.filter((m) => m.week <= weeks)

  const extra: Movement[] = []
  for (const branch of season.branches) {
    const templates = PILLARS[branch.pillar].templates
    for (let week = season.weeks + 1; week <= weeks; week += 1) {
      for (let order = 0; order < MOVES_PER_WEEK; order += 1) {
        const t = templates[((week - 1) * MOVES_PER_WEEK + order) % templates.length]
        extra.push({
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
  return [...state.movements, ...extra]
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'set-name':
      return { ...state, name: action.name }

    case 'create-season':
      return {
        ...state,
        name: action.name,
        season: {
          purpose: action.purpose,
          purposeDetail: action.purposeDetail,
          weeks: action.weeks,
          startedAt: new Date().toISOString(),
          branches: action.branches,
        },
        movements: buildPlan(action.branches, action.weeks),
      }

    case 'resolve':
      return {
        ...state,
        movements: state.movements.map((m) =>
          m.id === action.id
            ? { ...m, status: action.status, resolvedAt: new Date().toISOString(), note: action.note }
            : m,
        ),
      }

    case 'reopen':
      return {
        ...state,
        movements: state.movements.map((m) =>
          m.id === action.id
            ? { ...m, status: 'pendiente', resolvedAt: undefined, note: undefined }
            : m,
        ),
      }

    case 'update-branch': {
      if (!state.season) return state
      const previous = state.season.branches.find((b) => b.id === action.id)
      if (!previous) return state
      const updated = { ...previous, ...action.patch }
      const season = {
        ...state.season,
        branches: state.season.branches.map((b) => (b.id === action.id ? updated : b)),
      }

      // Cambiar de área cambia el repertorio: los movimientos aún pendientes se
      // rehacen con las plantillas nuevas; lo ya resuelto se respeta.
      if (updated.pillar === previous.pillar) return { ...state, season }

      const fresh = new Map(
        buildPlan([updated], season.weeks).map((m) => [m.id, m] as const),
      )
      const movements = state.movements.map((m) => {
        if (m.branchId !== action.id || m.status !== 'pendiente') return m
        return fresh.get(m.id) ?? m
      })
      return { ...state, season, movements }
    }

    case 'update-season': {
      if (!state.season) return state
      const weeks = action.patch.weeks ?? state.season.weeks
      const movements = withPlanLength(state, weeks)
      return {
        ...state,
        season: { ...state.season, ...action.patch, weeks },
        movements,
      }
    }

    case 'accountability':
      return { ...state, accountability: { ...state.accountability, ...action.patch } }

    case 'replace':
      return action.state

    case 'reset':
      return { ...EMPTY_STATE }

    default:
      return state
  }
}

/* Persistencia ------------------------------------------------------------ */

function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Partial<AppState>
  return typeof v.name === 'string' && Array.isArray(v.movements)
}

function load(): AppState {
  if (typeof localStorage === 'undefined') return EMPTY_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed: unknown = JSON.parse(raw)
    if (!isAppState(parsed)) return EMPTY_STATE
    return { ...EMPTY_STATE, ...parsed, version: VERSION }
  } catch {
    return EMPTY_STATE
  }
}

/* Temporada de ejemplo ---------------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DEMO_RATE: Record<string, number> = {
  cuerpo: 0.76,
  relaciones: 0.44,
  proyecto: 0.6,
}
const DEMO_DAY_OFFSET = [0, 1, 3, 5]

/** Temporada ilustrativa: datos inventados, útiles para recorrer el sistema. */
export function buildDemoState(now = new Date()): AppState {
  const branches: Branch[] = [
    { id: 'b-cuerpo', pillar: 'cuerpo', name: 'Cuerpo', goal: PILLARS.cuerpo.defaultGoal },
    {
      id: 'b-relaciones',
      pillar: 'relaciones',
      name: 'Relaciones',
      goal: PILLARS.relaciones.defaultGoal,
    },
    { id: 'b-proyecto', pillar: 'proyecto', name: 'Derwatt', goal: 'Lanzar Derwatt' },
  ]

  const started = startOfWeek(now)
  started.setDate(started.getDate() - 6 * 7)
  const weeks = 12
  const random = mulberry32(20260820)

  const movements = buildPlan(branches, weeks).map((m) => {
    const day = new Date(started)
    day.setDate(day.getDate() + (m.week - 1) * 7 + DEMO_DAY_OFFSET[m.order])
    day.setHours(8 + m.order * 3, 15, 0, 0)
    if (day.getTime() > now.getTime()) return m

    // La temporada de ejemplo va a mejor: las dos últimas semanas cunden más.
    const base = DEMO_RATE[m.branchId.replace('b-', '')] ?? 0.5
    const rate = m.week >= weeks / 2 ? Math.min(0.94, base + 0.22) : base
    const roll = random()
    if (roll < rate) return { ...m, status: 'hecho' as const, resolvedAt: day.toISOString() }
    if (roll < rate + 0.12)
      return {
        ...m,
        status: 'saltado' as const,
        resolvedAt: day.toISOString(),
        note: 'Se cruzó con el trabajo.',
      }
    return m
  })

  const lastValidation = new Date(now)
  lastValidation.setDate(lastValidation.getDate() - 2)

  return {
    version: VERSION,
    name: 'Alejandro',
    season: {
      purpose: 'Libertad individual',
      purposeDetail: 'Ser lo más yo mismo, todo el tiempo posible.',
      weeks,
      startedAt: started.toISOString(),
      branches,
    },
    movements,
    accountability: {
      mode: 'coach',
      partner: 'Marcos',
      lastValidationAt: lastValidation.toISOString(),
    },
  }
}

/* Contexto ---------------------------------------------------------------- */

interface Store {
  state: AppState
  dispatch: (action: Action) => void
  loadDemo: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* almacenamiento lleno o bloqueado: la sesión sigue funcionando en memoria */
    }
  }, [state])

  const loadDemo = useCallback(() => {
    dispatch({ type: 'replace', state: buildDemoState() })
  }, [])

  const value = useMemo(() => ({ state, dispatch, loadDemo }), [state, loadDemo])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore debe usarse dentro de <StoreProvider>')
  return store
}

export function pillarOf(branch: Branch) {
  return PILLARS[branch.pillar as PillarKey]
}
