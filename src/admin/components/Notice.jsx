// Message de confirmation ou d'erreur.
export default function Notice({ type = 'success', children }) {
  return (
    <p className={type === 'error' ? 'form__alert' : 'form__success'} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}
