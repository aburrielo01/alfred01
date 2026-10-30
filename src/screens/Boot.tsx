import { BrandIcon, BrandSign } from '../components/Brand'

export function Boot() {
  return (
    <div className="boot">
      <div className="boot__brand">
        <BrandIcon className="boot__icon" />
        <BrandSign trazo className="boot__mark" />
      </div>
      <div className="boot__foot">
        <span className="boot__spinner" aria-hidden />
        <p>Preparando tu sistema</p>
      </div>
    </div>
  )
}
