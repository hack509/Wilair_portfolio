// Champ de formulaire accessible : libellé associé, message d'erreur relié par aria-describedby.
export default function FormField({ id, label, error, hint, as = 'input', required = false, className = '', ...inputProps }) {
  const Control = as
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined

  return (
    <div className={`form-field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      <Control
        id={id}
        name={id}
        className="form-field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        required={required}
        {...inputProps}
      />
      {hint && (
        <p id={`${id}-hint`} className="form-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-field__error">
          {error}
        </p>
      )}
    </div>
  )
}
