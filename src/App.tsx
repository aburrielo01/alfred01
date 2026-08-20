import { useEffect, useMemo, useState } from 'react'
import { StoreProvider, useStore } from './app/store'
import { ToastProvider, useToast } from './components/ui'
import { PhoneFrame } from './components/PhoneFrame'
import { TabBar } from './components/TabBar'
import { MovementSheet } from './components/MovementSheet'
import { PulseSheet } from './components/PulseSheet'
import { Boot } from './screens/Boot'
import { Onboarding } from './screens/Onboarding'
import { Today } from './screens/Today'
import { System } from './screens/System'
import { Review } from './screens/Review'
import { Profile } from './screens/Profile'
import { BranchDetail } from './screens/BranchDetail'
import { pointsOf } from './app/engine'
import type { Route, Tab } from './app/nav'
import type { Movement } from './app/types'

const BOOT_MS = 1100

const TAB_LABELS: Record<Tab, string> = {
  hoy: 'Hoy',
  sistema: 'Sistema',
  revision: 'Revisión',
  perfil: 'Perfil',
}

function Shell() {
  const { state, dispatch } = useStore()
  const { notify } = useToast()
  const [booting, setBooting] = useState(true)
  const [route, setRoute] = useState<Route>({ tab: 'hoy' })
  const [openMoveId, setOpenMoveId] = useState<string | null>(null)
  const [pulseOpen, setPulseOpen] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setBooting(false), BOOT_MS)
    return () => clearTimeout(id)
  }, [])

  const openMove = useMemo(
    () => state.movements.find((m) => m.id === openMoveId) ?? null,
    [state.movements, openMoveId],
  )
  const openBranch = openMove
    ? state.season?.branches.find((b) => b.id === openMove.branchId)
    : undefined

  const confirm = (movement: Movement, status: 'hecho' | 'saltado', note?: string) => {
    dispatch({ type: 'resolve', id: movement.id, status, note })
    setOpenMoveId(null)
    const branch = state.season?.branches.find((b) => b.id === movement.branchId)
    notify(
      status === 'hecho'
        ? `Confirmado · +${pointsOf(movement)} puntos en ${branch?.name ?? 'tu sistema'}`
        : 'Guardado para la revisión',
    )
  }

  const go = (tab: Tab) => setRoute({ tab })

  if (booting) return <Boot />
  if (!state.season) return <Onboarding onCreated={() => setRoute({ tab: 'hoy' })} />

  const screen = route.branchId ? (
    <BranchDetail
      branchId={route.branchId}
      onBack={() => setRoute({ tab: route.tab })}
      backLabel={TAB_LABELS[route.tab]}
      onOpenMovement={(m) => setOpenMoveId(m.id)}
    />
  ) : route.tab === 'hoy' ? (
    <Today
      onOpenMovement={(m) => setOpenMoveId(m.id)}
      onOpenBranch={(branchId) => setRoute({ tab: 'hoy', branchId })}
      onPulse={() => setPulseOpen(true)}
      onReview={() => go('revision')}
    />
  ) : route.tab === 'sistema' ? (
    <System
      onOpenMovement={(m) => setOpenMoveId(m.id)}
      onOpenBranch={(branchId) => setRoute({ tab: 'sistema', branchId })}
      onPulse={() => setPulseOpen(true)}
      onDone={(m) => confirm(m, 'hecho')}
    />
  ) : route.tab === 'revision' ? (
    <Review onPulse={() => setPulseOpen(true)} />
  ) : (
    <Profile onPulse={() => setPulseOpen(true)} onReset={() => setRoute({ tab: 'hoy' })} />
  )

  return (
    <div className="app">
      <main className="app__main" key={route.branchId ?? route.tab}>
        {screen}
      </main>
      <TabBar tab={route.tab} onChange={go} />

      <MovementSheet
        movement={openMove}
        branch={openBranch}
        onClose={() => setOpenMoveId(null)}
        onResolve={(id, status, note) => {
          const movement = state.movements.find((m) => m.id === id)
          if (movement) confirm(movement, status, note)
        }}
        onReopen={(id) => {
          dispatch({ type: 'reopen', id })
          notify('Vuelve a estar pendiente')
        }}
      />

      <PulseSheet open={pulseOpen} state={state} onClose={() => setPulseOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <PhoneFrame>
        <ToastProvider>
          <Shell />
        </ToastProvider>
      </PhoneFrame>
    </StoreProvider>
  )
}
