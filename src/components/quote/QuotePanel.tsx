import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { brand } from '../../config/brand'
import { commerce } from '../../config/commerce'
import type { CartItem } from '../../lib/types'
import { buildQuoteMessage, copyText, hasWhatsapp, whatsappUrl } from '../../lib/whatsapp'
import { isEmail, isPhone } from '../../lib/validation'
import { Field, describedBy } from '../ui/Field'
import Notice from '../ui/Notice'

/**
 * Prepara la solicitud de cotización.
 * - No envía nada a ningún servidor.
 * - WhatsApp solo se abre si hay número configurado y el usuario confirmó haber revisado el mensaje.
 * - La descripción de la persona homenajeada se excluye por defecto.
 */
export default function QuotePanel({ items }: { items: CartItem[] }) {
  const [contact, setContact] = useState({ name: '', phone: '', email: '', notes: '' })
  const [includeStory, setIncludeStory] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<'ok' | 'fail' | ''>('')
  const [ready, setReady] = useState(false)

  const anyStory = items.some((i) => i.config.aboutPerson.trim())
  const message = useMemo(
    () => buildQuoteMessage(items, { ...contact, includePersonalStory: includeStory }),
    [items, contact, includeStory],
  )

  const update = (k: keyof typeof contact, v: string) => {
    setContact((c) => ({ ...c, [k]: v }))
    setReviewed(false)
    setCopied('')
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (contact.name.trim().length < 2) e.name = 'Escribe tu nombre para que sepamos a quién responder.'
    if (!contact.phone.trim()) e.phone = 'Necesitamos un teléfono para coordinar.'
    else if (!isPhone(contact.phone)) e.phone = 'Revisa el número. Ej.: 987 654 321'
    if (contact.email.trim() && !isEmail(contact.email)) e.email = 'El correo no parece válido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onPrepare = (ev: FormEvent) => {
    ev.preventDefault()
    if (validate()) setReady(true)
  }

  const onCopy = async () => {
    const ok = await copyText(message)
    setCopied(ok ? 'ok' : 'fail')
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onPrepare} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field id="q-name" label="Tu nombre" error={errors.name}>
          <input id="q-name" className="field-input" value={contact.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy('q-name', errors.name)} />
        </Field>
        <Field id="q-phone" label="Teléfono" error={errors.phone}>
          <input id="q-phone" className="field-input" type="tel" inputMode="tel" value={contact.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describedBy('q-phone', errors.phone)} />
        </Field>
        <Field id="q-email" label="Correo" optional error={errors.email}>
          <input id="q-email" className="field-input" type="email" value={contact.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy('q-email', errors.email)} />
        </Field>
        <Field id="q-notes" label="Comentarios" optional>
          <input id="q-notes" className="field-input" value={contact.notes} onChange={(e) => update('notes', e.target.value)} />
        </Field>
        {anyStory && (
          <label className="flex items-start gap-3 border-l-2 border-terracota py-1 pl-4 text-sm sm:col-span-2">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-salvia-oscura" checked={includeStory} onChange={(e) => { setIncludeStory(e.target.checked); setReviewed(false) }} />
            <span>
              Incluir en el mensaje lo que escribí sobre la persona homenajeada.{' '}
              <span className="text-piedra">Por defecto no se incluye. Compártelo solo si te sientes cómodo(a) haciéndolo.</span>
            </span>
          </label>
        )}
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Ver mi mensaje
          </button>
        </div>
      </form>

      {ready && (
        <section aria-labelledby="preview-title" className="space-y-4">
          <h3 id="preview-title" className="text-[28px]">
            Revisa tu mensaje
          </h3>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap bg-papel p-5 font-mono text-[13px] leading-relaxed text-tinta ring-1 ring-tinta/10" tabIndex={0} aria-label="Vista previa del mensaje">
            {message}
          </pre>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-salvia-oscura" checked={reviewed} onChange={(e) => setReviewed(e.target.checked)} />
            <span>He revisado el mensaje y confirmo que la información puede compartirse.</span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            {hasWhatsapp() ? (
              <a
                href={reviewed ? whatsappUrl(message) : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!reviewed}
                onClick={(e) => !reviewed && e.preventDefault()}
                className={`btn-accent ${reviewed ? '' : 'pointer-events-none opacity-50'}`}
              >
                Abrir WhatsApp
              </a>
            ) : null}
            <button type="button" className={hasWhatsapp() ? 'btn-ghost' : 'btn-accent'} onClick={onCopy} disabled={!reviewed}>
              Copiar mensaje
            </button>
          </div>
          {!reviewed && <p className="text-sm text-piedra">Marca la confirmación para continuar.</p>}
          {copied === 'ok' && <p className="text-sm text-salvia-oscura" role="status">Mensaje copiado. Pégalo en el canal que prefieras.</p>}
          {copied === 'fail' && <p className="text-sm text-terracota-oscura" role="alert">No pudimos copiar automáticamente. Selecciona el texto y cópialo manualmente.</p>}
          {!hasWhatsapp() && (
            <Notice>
              {brand.name} aún no tiene un número de WhatsApp configurado en esta demostración. Puedes copiar el mensaje y enviarlo por el
              canal que prefieras.
            </Notice>
          )}
          <Notice>Esto no es una compra ni una reserva. {commerce.availabilityDisclaimer}</Notice>
        </section>
      )}
    </div>
  )
}
