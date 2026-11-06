export default function AdminHeader({ title, intro, children }) {
  return (
    <header className="admin-header">
      <div>
        <h1 className="admin-header__title">{title}</h1>
        {intro && <p className="muted">{intro}</p>}
      </div>
      {children && <div className="actions">{children}</div>}
    </header>
  )
}
