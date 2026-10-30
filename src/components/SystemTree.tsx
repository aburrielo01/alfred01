import { Index } from './Index'
import { Pct } from './Pct'
import { ProgressBar, Tag } from './ui'
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
      <svg className="tree__wires" viewBox="0 0 300 34" preserveAspectRatio="none" aria-hidden>
        <line x1="150" y1="12" x2="150" y2="20" />
        <line x1="50" y1="20" x2="250" y2="20" />
        <line x1="50" y1="20" x2="50" y2="34" />
        <line x1="150" y1="20" x2="150" y2="34" />
        <line x1="250" y1="20" x2="250" y2="34" />
        <circle className="tree__hub" cx="150" cy="6" r="5" />
        <circle className="tree__core" cx="150" cy="6" r="2" />
      </svg>

      <ul className="tree__row">
        {progress.map((p, i) => {
          const weak = p.branch.id === weakestId
          return (
            <li key={p.branch.id}>
              <button
                type="button"
                className={`tree__node ${weak ? 'is-neglected' : ''}`}
                onClick={() => onOpen(p.branch.id)}
              >
                <span className="tree__index">
                  <Index n={i + 1} />
                </span>
                <span className="tree__name">{p.branch.name}</span>
                <span className="tree__goal">{p.branch.goal}</span>
                {weak ? <Tag tone="tint">Descuidada</Tag> : null}
                <span className="tree__percent"><Pct value={p.percent} /></span>
                <ProgressBar
                  value={p.percent}
                  color={weak ? 'var(--alert)' : 'var(--ink)'}
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
