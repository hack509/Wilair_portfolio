import { Plus, Trash2 } from 'lucide-react'
import Button from '../../components/common/Button'

/**
 * Liste d'éléments structurés (expériences, langues…).
 * @param renderItem (item, change, index) => champs de l'élément ; change(patch) le met à jour
 * @param createItem () => nouvel élément vide
 */
export default function RepeaterField({ legend, itemLabel, value, onChange, createItem, renderItem }) {
  const change = (index, patch) => onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)))

  return (
    <fieldset className="admin-repeater">
      <legend className="section-title">{legend}</legend>
      {value.map((item, index) => (
        <div key={item.id} className="admin-repeater__item">
          {renderItem(item, (patch) => change(index, patch), index)}
          <button
            type="button"
            className="admin-icon-button admin-repeater__remove"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            aria-label={`Retirer : ${itemLabel} ${index + 1}`}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      ))}
      <Button variant="outline" icon={Plus} iconPosition="start" onClick={() => onChange([...value, createItem()])}>
        Ajouter : {itemLabel}
      </Button>
    </fieldset>
  )
}
