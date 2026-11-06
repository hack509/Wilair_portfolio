import { Archive, ArchiveRestore, Mail, MailOpen, Reply, Trash2 } from 'lucide-react'
import { useState } from 'react'
import AsyncContent from '../../components/common/AsyncContent'
import Button from '../../components/common/Button'
import { EmptyState } from '../../components/common/StateMessages'
import { useAsync } from '../../hooks/useAsync'
import { usePageMeta } from '../../hooks/usePageMeta'
import { deleteMessage, listMessages, MESSAGES_PER_PAGE, updateMessageFlags } from '../../services/contactService'
import { formatDateTime, toMailHref } from '../../utils/format'
import AdminHeader from '../components/AdminHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import Notice from '../components/Notice'
import { useAdminAction } from '../hooks'

const FILTERS = [
  { id: 'inbox', label: 'Reçus' },
  { id: 'unread', label: 'Non lus' },
  { id: 'archived', label: 'Archivés' },
]

export default function AdminMessages() {
  usePageMeta({ title: 'Messages' })
  const [filter, setFilter] = useState('inbox')
  const [page, setPage] = useState(0)
  const messagesState = useAsync(() => listMessages({ filter, page }), [filter, page])
  const { notice, busy, run } = useAdminAction(messagesState.reload)
  const [toDelete, setToDelete] = useState(null)

  const selectFilter = (id) => {
    setFilter(id)
    setPage(0)
  }

  const confirmDelete = () => {
    const message = toDelete
    setToDelete(null)
    run(() => deleteMessage(message.id), 'Le message a été supprimé.')
  }

  return (
    <>
      <AdminHeader title="Messages" intro="Messages envoyés depuis le formulaire de contact." />

      {notice && <Notice type={notice.type}>{notice.text}</Notice>}

      <div className="filter" role="group" aria-label="Filtrer les messages">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`filter__button ${filter === item.id ? 'is-active' : ''}`}
            aria-pressed={filter === item.id}
            onClick={() => selectFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <AsyncContent {...messagesState} isEmpty={(data) => !data || data.messages.length === 0} empty={<EmptyState title="Aucun message ici" />}>
        {({ messages, total }) => {
          const lastPage = Math.max(0, Math.ceil(total / MESSAGES_PER_PAGE) - 1)
          return (
            <>
              <ul className="admin-messages">
                {messages.map((message) => (
                  <li key={message.id} className={`admin-message ${message.isRead ? '' : 'is-unread'}`}>
                    <header className="admin-message__header">
                      <div>
                        <h2 className="admin-message__subject">{message.subject}</h2>
                        <p className="muted">
                          {message.senderName} · <a href={toMailHref(message.senderEmail)}>{message.senderEmail}</a>
                        </p>
                      </div>
                      <time className="form-field__hint" dateTime={message.createdAt}>
                        {formatDateTime(message.createdAt)}
                      </time>
                    </header>
                    <p className="admin-message__body">{message.message}</p>
                    <div className="actions">
                      <Button href={toMailHref(message.senderEmail, `Re: ${message.subject}`)} variant="outline" icon={Reply} iconPosition="start">
                        Répondre
                      </Button>
                      <Button
                        variant="outline"
                        icon={message.isRead ? Mail : MailOpen}
                        iconPosition="start"
                        disabled={busy}
                        onClick={() =>
                          run(
                            () => updateMessageFlags(message.id, { isRead: !message.isRead }),
                            message.isRead ? 'Message marqué comme non lu.' : 'Message marqué comme lu.',
                          )
                        }
                      >
                        {message.isRead ? 'Marquer non lu' : 'Marquer lu'}
                      </Button>
                      <Button
                        variant="outline"
                        icon={message.isArchived ? ArchiveRestore : Archive}
                        iconPosition="start"
                        disabled={busy}
                        onClick={() =>
                          run(
                            () => updateMessageFlags(message.id, { isArchived: !message.isArchived }),
                            message.isArchived ? 'Message restauré.' : 'Message archivé.',
                          )
                        }
                      >
                        {message.isArchived ? 'Restaurer' : 'Archiver'}
                      </Button>
                      <button
                        type="button"
                        className="admin-icon-button admin-icon-button--danger"
                        disabled={busy}
                        aria-label={`Supprimer le message de ${message.senderName}`}
                        onClick={() => setToDelete(message)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {lastPage > 0 && (
                <nav className="admin-pagination" aria-label="Pagination">
                  <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>
                    Précédent
                  </Button>
                  <span>
                    Page {page + 1} sur {lastPage + 1}
                  </span>
                  <Button variant="outline" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
                    Suivant
                  </Button>
                </nav>
              )}
            </>
          )
        }}
      </AsyncContent>

      <ConfirmDialog
        request={
          toDelete && {
            title: 'Supprimer ce message ?',
            message: `Le message de ${toDelete.senderName} sera définitivement supprimé.`,
          }
        }
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
