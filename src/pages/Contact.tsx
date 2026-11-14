import { useState } from 'react'
import type { FormEvent } from 'react'
import { brand } from '../config/brand'
import Faq from '../components/ui/Faq'
import { Field, describedBy } from '../components/ui/Field'
import Notice from '../components/ui/Notice'
import SectionHeading from '../components/ui/SectionHeading'
import { isEmail, isPhone } from '../lib/validation'
import { hasWhatsapp, whatsappUrl } from '../lib/whatsapp'

const reasons = ['Quiero orientación para elegir un homenaje', 'Consulta sobre un pedido especial', 'Consulta corporativa', 'Otro motivo']

export default function Contact() {
  const [form, setForm] = useState({ name: '', contact: '', reason: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = 'Escribe tu nombre.'
    if (!isEmail(form.contact) && !isPhone(form.contact)) e.contact = 'Escribe un correo o teléfono válido.'
    if (!form.reason) e.reason = 'Elige un motivo.'
    if (form.message.trim().length < 10) e.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) {
      document.getElementById(`c-${first}`)?.focus()
      return
    }
    setSent(true)
  }

  return (
    <div className="container-l pb-28 pt-12 lg:pt-20">
      <div className="grid-l gap-y-12">
        <div className="col-span-4 lg:col-span-5">
          <SectionHeading as="h1" eyebrow="Contacto" title={<>Escríbenos, <em className="text-terracota">sin apuro.</em></>}>
            <p>Si no sabes por dónde empezar, cuéntanos para quién es y te ayudamos a pensarlo.</p>
          </SectionHeading>

          <div className="mt-8 space-y-4">
            {hasWhatsapp() ? (
              <a href={whatsappUrl(`Hola, ${brand.name}. Quisiera hacer una consulta.`)} target="_blank" rel="noreferrer" className="btn-accent">
                Escribir por WhatsApp
              </a>
            ) : (
              <Notice>El número de WhatsApp aún no está configurado en esta demostración.</Notice>
            )}
            {brand.contactEmail && <p className="text-piedra">Correo: {brand.contactEmail}</p>}
            <p className="ficha">Atención inicial · {brand.city}</p>
          </div>
        </div>

        <div className="col-span-4 border-t-2 border-tinta pt-6 lg:col-span-6 lg:col-start-7">
          {sent ? (
            <div role="status" className="space-y-4">
              <h2 className="text-[36px]">Gracias, {form.name.split(' ')[0]}.</h2>
              <p className="text-piedra">
                Este es un formulario de demostración: tu mensaje no fue enviado ni almacenado. En la versión comercial, nuestro equipo te
                respondería por el medio que indicaste.
              </p>
              <button type="button" className="btn-ghost" onClick={() => { setForm({ name: '', contact: '', reason: '', message: '' }); setSent(false) }}>
                Escribir otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <p className="ficha">Formulario de demostración</p>
              <Field id="c-name" label="Nombre" error={errors.name}>
                <input id="c-name" className="field-input" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy('c-name', errors.name)} />
              </Field>
              <Field id="c-contact" label="Correo o teléfono" error={errors.contact}>
                <input id="c-contact" className="field-input" value={form.contact} onChange={(e) => set('contact', e.target.value)} aria-invalid={!!errors.contact} aria-describedby={describedBy('c-contact', errors.contact)} />
              </Field>
              <Field id="c-reason" label="Motivo" error={errors.reason}>
                <select id="c-reason" className="field-input" value={form.reason} onChange={(e) => set('reason', e.target.value)} aria-invalid={!!errors.reason} aria-describedby={describedBy('c-reason', errors.reason)}>
                  <option value="">Elige un motivo</option>
                  {reasons.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field id="c-message" label="Mensaje" error={errors.message}>
                <textarea id="c-message" rows={5} maxLength={1000} className="field-input" value={form.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={describedBy('c-message', errors.message)} />
              </Field>
              <button type="submit" className="btn-primary w-full">
                Enviar mensaje (demo)
              </button>
              <p className="ficha normal-case tracking-normal">No almacenamos ni enviamos esta información a ningún servidor.</p>
            </form>
          )}
        </div>
      </div>

      <section className="grid-l mt-28 gap-y-8" aria-labelledby="faq-contacto">
        <div className="col-span-4 lg:col-span-3">
          <p className="ficha">Preguntas</p>
          <h2 id="faq-contacto" className="mt-3 text-[40px]">Antes de escribir</h2>
        </div>
        <div className="col-span-4 lg:col-span-8 lg:col-start-5">
          <Faq />
        </div>
      </section>
    </div>
  )
}
