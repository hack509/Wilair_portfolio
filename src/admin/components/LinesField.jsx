import { useState } from 'react'
import FormField from '../../components/forms/FormField'

const parse = (text, separator) =>
  text
    .split(separator)
    .map((line) => line.trim())
    .filter(Boolean)

/**
 * Liste de textes saisie dans une zone de texte.
 * Par défaut une valeur par ligne ; `paragraphs` sépare les valeurs par une ligne vide.
 */
export default function LinesField({ id, label, hint, value, onChange, error, paragraphs = false, rows = 4 }) {
  const [text, setText] = useState(() => value.join(paragraphs ? '\n\n' : '\n'))

  return (
    <FormField
      id={id}
      as="textarea"
      label={label}
      hint={hint ?? (paragraphs ? 'Séparez les paragraphes par une ligne vide.' : 'Une valeur par ligne.')}
      rows={rows}
      value={text}
      error={error}
      onChange={(event) => {
        setText(event.target.value)
        onChange(parse(event.target.value, paragraphs ? /\n\s*\n/ : /\n/))
      }}
    />
  )
}
