import { MessageCircle, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { chatbotFallback, chatbotGreeting, chatbotIntents, chatbotSuggestions } from '../../data/chatbotData'
import { useProfile } from '../../hooks/useProfile'
import { findIntent } from '../../utils/chatbot'
import { toWhatsAppHref } from '../../utils/whatsapp'

const suggestions = chatbotSuggestions.map((id) => chatbotIntents.find((intent) => intent.id === id))
const greeting = { id: 'greeting', from: 'bot', text: chatbotGreeting, suggestions }

let messageId = 0
const nextId = () => `msg-${++messageId}`

// Assistant de navigation : oriente le visiteur vers la bonne page à partir de mots-clés.
export default function ChatbotWidget() {
  const navigate = useNavigate()
  const { data: profile } = useProfile()
  const whatsappHref = toWhatsAppHref(profile?.whatsappNumber, profile?.whatsappMessage)

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([greeting])
  const inputRef = useRef(null)
  const logRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    inputRef.current?.focus()
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Fait défiler la conversation jusqu'au dernier message.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages, open])

  const respond = (userText, intent) => {
    const userMessage = { id: nextId(), from: 'user', text: userText }
    const botMessage = intent
      ? { id: nextId(), from: 'bot', text: intent.answer, intent }
      : { id: nextId(), from: 'bot', text: chatbotFallback, suggestions }

    setMessages((current) => [...current, userMessage, botMessage])
    if (intent?.to) navigate(intent.to)
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    respond(text, findIntent(text, chatbotIntents))
  }

  return (
    <div className="chatbot">
      {open && (
        <section id="chatbot-panel" className="chatbot__panel" aria-label="Assistant de navigation">
          <header className="chatbot__header">
            <p className="chatbot__title">Assistant</p>
            <button type="button" className="chatbot__close" onClick={() => setOpen(false)} aria-label="Fermer l'assistant">
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <ol ref={logRef} className="chatbot__log" role="log" aria-live="polite">
            {messages.map((message) => (
              <li key={message.id} className={`chatbot__message chatbot__message--${message.from}`}>
                <p>{message.text}</p>

                {message.intent?.to && (
                  <Link to={message.intent.to} className="chatbot__link">
                    Aller à : {message.intent.label}
                  </Link>
                )}
                {message.intent?.whatsapp && whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="chatbot__link">
                    Ouvrir WhatsApp
                  </a>
                )}

                {message.suggestions && (
                  <div className="chatbot__suggestions">
                    {message.suggestions.map((intent) => (
                      <button key={intent.id} type="button" className="chatbot__chip" onClick={() => respond(intent.label, intent)}>
                        {intent.label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>

          <form className="chatbot__form" onSubmit={onSubmit}>
            <label htmlFor="chatbot-input" className="visually-hidden">
              Votre question
            </label>
            <input
              ref={inputRef}
              id="chatbot-input"
              className="chatbot__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ex. : je cherche un photographe"
              autoComplete="off"
              maxLength={200}
            />
            <button type="submit" className="chatbot__send" aria-label="Envoyer">
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="chatbot__toggle"
        aria-expanded={open}
        aria-controls="chatbot-panel"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={24} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
        <span className="visually-hidden">{open ? "Fermer l'assistant" : 'Ouvrir l’assistant de navigation'}</span>
      </button>
    </div>
  )
}
