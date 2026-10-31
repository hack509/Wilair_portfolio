import { formatPeriod } from '../../utils/format'

// Chronologie : { id, role, organization, startYear, endYear, tasks[] }
export default function Timeline({ items }) {
  return (
    <ol className="timeline">
      {items.map((item) => (
        <li key={item.id} className="timeline__item">
          <p className="timeline__period">{formatPeriod(item.startYear, item.endYear)}</p>
          <div>
            <h3 className="timeline__title">{item.role}</h3>
            <p className="timeline__organization">{item.organization}</p>
            {item.tasks?.length > 0 && (
              <ul className="bullet-list">
                {item.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
