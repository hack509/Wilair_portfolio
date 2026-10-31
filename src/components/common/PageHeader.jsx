// En-tête commun des pages intérieures.
export default function PageHeader({ eyebrow, title, intro }) {
  return (
    <header className="page-header">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {intro && <p className="page-header__intro">{intro}</p>}
      </div>
    </header>
  )
}
