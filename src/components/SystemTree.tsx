import { BranchBadge } from './BranchIcon'
import { ProgressBar, Tag } from './ui'
import { PILLARS } from '../app/pillars'
import type { BranchProgress } from '../app/types'

export function SystemTree({
  progress,
  weakestId,
  onOpen,
}: {
  progress: BranchProgress[]
  weakestId?: string
  onOpen: (branchId: string) => void
}) {
  return (
    <div className="tree">
      <svg className="tree__wires" viewBox="0 0 300 46" preserveAspectRatio="none" aria-hidden>
        <line x1="150" y1="14" x2="150" y2="26" />
        <line x1="50" y1="26" x2="250" y2="26" />
        <line x1="50" y1="26" x2="50" y2="46" />
        <line x1="150" y1="26" x2="150" y2="46" />
        <line x1="250" y1="26" x2="250" y2="46" />
        <circle className="tree__hub" cx="150" cy="8" r="7" />
        <circle className="tree__core" cx="150" cy="8" r="2.4" />
      </svg>

      <ul className="tree__row">
        {progress.map((p) => {
          const pillar = PILLARS[p.branch.pillar]
          const weak = p.branch.id === weakestId
          return (
            <li key={p.branch.id}>
              <button
                type="button"
                className={`tree__node ${weak ? 'is-weak' : ''}`}
                style={{ '--tone': pillar.color } as React.CSSProperties}
                onClick={() => onOpen(p.branch.id)}
              >
                <BranchBadge pillar={p.branch.pillar} color={pillar.color} size={44} muted={weak} />
                <span className="tree__name">{p.branch.name}</span>
                <span className="tree__goal">{p.branch.goal}</span>
                {weak ? <Tag tone="tint">Área más descuidada</Tag> : null}
                <span className="tree__percent num" style={{ color: weak ? 'var(--ink-2)' : pillar.color }}>
                  {p.percent}%
                </span>
                <ProgressBar
                  value={p.percent}
                  color={weak ? 'var(--ink-3)' : pillar.color}
                  label={`Cumplimiento de ${p.branch.name}`}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
