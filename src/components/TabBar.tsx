import type { Tab } from '../app/nav'

const TABS: { id: Tab; label: string }[] = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'sistema', label: 'Sistema' },
  { id: 'revision', label: 'Revisión' },
  { id: 'perfil', label: 'Perfil' },
]

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Secciones">
      <ul>
        {TABS.map(({ id, label }, i) => {
          const active = id === tab
          return (
            <li key={id}>
              <button
                type="button"
                className={`tabbar__item ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => onChange(id)}
              >
                <span className="tabbar__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="tabbar__label">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
