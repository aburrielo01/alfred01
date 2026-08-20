import { Box, ChartNoAxesColumn, Sun, User } from 'lucide-react'
import type { Tab } from '../app/nav'

const TABS: { id: Tab; label: string; Icon: typeof Sun }[] = [
  { id: 'hoy', label: 'Hoy', Icon: Sun },
  { id: 'sistema', label: 'Sistema', Icon: Box },
  { id: 'revision', label: 'Revisión', Icon: ChartNoAxesColumn },
  { id: 'perfil', label: 'Perfil', Icon: User },
]

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Secciones">
      <ul>
        {TABS.map(({ id, label, Icon }) => {
          const active = id === tab
          return (
            <li key={id}>
              <button
                type="button"
                className={`tabbar__item ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => onChange(id)}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} aria-hidden />
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
