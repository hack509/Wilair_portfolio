export default function CheckboxField({ id, label, hint, checked, onChange }) {
  return (
    <div className="admin-checkbox">
      <input id={id} name={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <label htmlFor={id}>
        {label}
        {hint && <span className="form-field__hint">{hint}</span>}
      </label>
    </div>
  )
}
