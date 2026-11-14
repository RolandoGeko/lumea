import { jumpTo } from '../lib/jump'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { brand } from '../config/brand'
import { b2bBenefits, b2bFuture, b2bRequestTypes } from '../content/b2b'
import { budgets, districts } from '../data/options'
import Photo from '../components/ui/Photo'
import { Field, describedBy } from '../components/ui/Field'
import Notice from '../components/ui/Notice'
import { isEmail, isPhone, isRuc } from '../lib/validation'
import { copyText, hasWhatsapp, whatsappUrl } from '../lib/whatsapp'

const initial = {
  requestType: '',
  company: '',
  ruc: '',
  businessName: '',
  contactName: '',
  role: '',
  email: '',
  phone: '',
  quantity: '',
  frequency: '',
  budgetId: '',
  district: '',
  message: '',
  consent: false,
}

type FormState = typeof initial

function validate(f: FormState) {
  const e: Partial<Record<keyof FormState, string>> = {}
  if (!f.requestType) e.requestType = 'Elige el tipo de solicitud.'
  if (f.company.trim().length < 2) e.company = 'Indica el nombre de tu empresa o institución.'
  if (f.ruc.trim() && !isRuc(f.ruc)) e.ruc = 'El RUC debe tener 11 dígitos y empezar en 10, 15, 17 o 20.'
  if (f.contactName.trim().length < 2) e.contactName = 'Indica el nombre de la persona de contacto.'
  if (!isEmail(f.email)) e.email = 'Escribe un correo corporativo válido.'
  if (!isPhone(f.phone)) e.phone = 'Escribe un teléfono válido. Ej.: 987 654 321'
  if (f.quantity && (!/^\d+$/.test(f.quantity) || Number(f.quantity) < 1 || Number(f.quantity) > 500)) e.quantity = 'Escribe un número entre 1 y 500.'
  if (f.message.length > 800) e.message = 'Máximo 800 caracteres.'
  if (!f.consent) e.consent = 'Confirma que entiendes que es una demostración.'
  return e
}

function buildSummary(f: FormState) {
  const type = b2bRequestTypes.find((t) => t.id === f.requestType)?.name
  const rows = [
    `Hola, ${brand.name}. Quisiera hacer una consulta corporativa.`,
    '',
    `• Tipo de solicitud: ${type}`,
    `• Empresa / institución: ${f.company}`,
    f.businessName && `• Razón social: ${f.businessName}`,
    f.ruc && `• RUC: ${f.ruc}`,
    `• Contacto: ${f.contactName}${f.role ? ` (${f.role})` : ''}`,
    `• Correo: ${f.email}`,
    `• Teléfono: ${f.phone}`,
    f.quantity && `• Cantidad estimada: ${f.quantity}`,
    f.frequency && `• Frecuencia: ${f.frequency}`,
    f.budgetId && `• Presupuesto por arreglo: ${budgets.find((b) => b.id === f.budgetId)?.name}`,
    f.district && `• Distrito principal: ${f.district}`,
    f.message && `• Detalle: ${f.message}`,
  ]
  return rows.filter((r): r is string => typeof r === 'string' && r !== '').join('\n').replace('consulta corporativa.\n', 'consulta corporativa.\n\n')
}

export default function Business() {
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate(form)
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) {
      document.getElementById(`b-${first}`)?.focus()
      return
    }
    setSent(true)
  }

  const summary = buildSummary(form)

  return (
    <>
      <section className="container-l pb-20 pt-12 lg:pt-20">
        <div className="grid-l items-end gap-y-10">
          <div className="col-span-4 lg:col-span-7">
            <p className="ficha">Empresas, funerarias e instituciones</p>
            <h1 className="mt-5 text-[52px] sm:text-[72px] lg:text-[88px]">
              Cuando una empresa acompaña, <em className="text-terracota">que no suene a trámite.</em>
            </h1>
            <p className="mt-8 max-w-lg text-[17px] text-piedra">
              Condolencias para colaboradores, clientes y familias atendidas, con piezas que la familia conserva y un mensaje que no parece
              plantilla.
            </p>
            <a href="#cotizacion" onClick={jumpTo('cotizacion')} className="btn-primary mt-8">Solicitar una propuesta</a>
          </div>
          <Photo id="linhle" eager className="col-span-4 aspect-[4/5] lg:col-span-4 lg:col-start-9" />
        </div>
      </section>

      <section className="container-l pb-24" aria-labelledby="servicios">
        <div className="grid-l gap-y-8">
          <div className="col-span-4 lg:col-span-3">
            <p className="ficha">Qué atendemos</p>
            <h2 id="servicios" className="mt-3 text-[40px]">Cinco tipos de encargo</h2>
          </div>
          <ol className="col-span-4 border-t border-tinta/20 lg:col-span-8 lg:col-start-5">
            {b2bRequestTypes.map((t, i) => (
              <li key={t.id} className="grid grid-cols-[48px_1fr] gap-4 border-b border-tinta/15 py-5 sm:grid-cols-[48px_1fr_1fr]">
                <span className="ficha pt-2">0{i + 1}</span>
                <h3 className="text-[28px] leading-tight">{t.name}</h3>
                <p className="col-start-2 text-[15px] text-piedra sm:col-start-3 sm:pt-1">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-tinta py-24 text-papel">
        <div className="container-l grid-l gap-y-14">
          <div className="col-span-4 lg:col-span-6">
            <p className="ficha !text-arena">Cómo es trabajar con nosotros</p>
            <ul className="mt-8">
              {b2bBenefits.map((b) => (
                <li key={b.title} className="border-t border-papel/15 py-6">
                  <h3 className="text-[30px] !text-papel">{b.title}</h3>
                  <p className="mt-2 max-w-md text-[15px] text-papel/70">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 lg:col-span-4 lg:col-start-9">
            <p className="ficha !text-arena">En preparación</p>
            <h2 className="mt-4 text-[34px] !text-papel">Cuentas y pedidos recurrentes</h2>
            <p className="mt-3 text-[15px] text-papel/70">Todavía no existen. Mientras tanto, los atendemos uno a uno.</p>
            <ul className="mt-6 border-t border-papel/15">
              {b2bFuture.map((f) => (
                <li key={f} className="border-b border-papel/15 py-3 text-[15px] text-papel/85">{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="cotizacion" className="container-l scroll-mt-28 py-24" aria-labelledby="cotizacion-titulo">
        <div className="max-w-3xl">
          <p className="ficha">Formulario de demostración</p>
          <h2 id="cotizacion-titulo" className="mt-3 text-[40px] sm:text-[52px]">
            Solicitar una propuesta
          </h2>
          <Notice className="mt-4">
            Este formulario funciona en modo demostración: valida los datos y prepara un resumen, pero no envía ni almacena información en ningún servidor.
          </Notice>

          {sent ? (
            <div className="mt-10 space-y-5 border-t border-tinta/20 pt-8" role="status">
              <h3 className="text-[36px]">Gracias, {form.contactName.split(' ')[0]}.</h3>
              <p className="text-piedra">
                En una operación real, nuestro equipo corporativo te contactaría para entender tu necesidad. Por ahora, este es el resumen que
                se habría enviado. Puedes revisarlo y compartirlo tú mismo(a).
              </p>
              <pre className="whitespace-pre-wrap bg-papel p-5 font-mono text-[13px] ring-1 ring-tinta/10">{summary}</pre>
              <div className="flex flex-col gap-3 sm:flex-row">
                {hasWhatsapp() && (
                  <a href={whatsappUrl(summary)} target="_blank" rel="noreferrer" className="btn-accent">
                    Abrir WhatsApp
                  </a>
                )}
                <button type="button" className={hasWhatsapp() ? 'btn-ghost' : 'btn-accent'} onClick={async () => setCopied(await copyText(summary))}>
                  Copiar resumen
                </button>
                <button type="button" className="btn-ghost" onClick={() => { setForm(initial); setSent(false); setCopied(false) }}>
                  Nueva solicitud
                </button>
              </div>
              {copied && <p className="text-sm text-salvia-oscura">Resumen copiado.</p>}
              {!hasWhatsapp() && <p className="text-sm text-piedra">Aún no hay un número de WhatsApp configurado en esta demostración.</p>}
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-8">
              <fieldset>
                <legend className="field-label">Tipo de solicitud</legend>
                <div id="b-requestType" tabIndex={-1} className="flex flex-wrap gap-2">
                  {b2bRequestTypes.map((t) => (
                    <button key={t.id} type="button" aria-pressed={form.requestType === t.id} onClick={() => set('requestType', t.id)} className={form.requestType === t.id ? 'chip-on' : 'chip-off'}>
                      {t.name}
                    </button>
                  ))}
                </div>
                {errors.requestType && <p className="field-error" role="alert">{errors.requestType}</p>}
              </fieldset>

              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className="ficha mb-4 border-t border-tinta/15 pt-4 w-full sm:col-span-2">Datos de la empresa</legend>
                <Field id="b-company" label="Empresa o institución" error={errors.company}>
                  <input id="b-company" className="field-input" value={form.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" aria-invalid={!!errors.company} aria-describedby={describedBy('b-company', errors.company)} />
                </Field>
                <Field id="b-businessName" label="Razón social" optional>
                  <input id="b-businessName" className="field-input" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} />
                </Field>
                <Field id="b-ruc" label="RUC" optional error={errors.ruc} hint="11 dígitos. Útil para futuras facturas.">
                  <input id="b-ruc" className="field-input" inputMode="numeric" maxLength={11} value={form.ruc} onChange={(e) => set('ruc', e.target.value.replace(/\D/g, ''))} aria-invalid={!!errors.ruc} aria-describedby={describedBy('b-ruc', errors.ruc, 'x')} />
                </Field>
                <Field id="b-district" label="Distrito principal" optional>
                  <select id="b-district" className="field-input" value={form.district} onChange={(e) => set('district', e.target.value)}>
                    <option value="">Elige un distrito</option>
                    {districts.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              </fieldset>

              <fieldset className="grid gap-5 sm:grid-cols-2">
                <legend className="ficha mb-4 border-t border-tinta/15 pt-4 w-full sm:col-span-2">Contacto empresarial</legend>
                <Field id="b-contactName" label="Nombre completo" error={errors.contactName}>
                  <input id="b-contactName" className="field-input" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} autoComplete="name" aria-invalid={!!errors.contactName} aria-describedby={describedBy('b-contactName', errors.contactName)} />
                </Field>
                <Field id="b-role" label="Cargo" optional>
                  <input id="b-role" className="field-input" value={form.role} onChange={(e) => set('role', e.target.value)} autoComplete="organization-title" placeholder="Ej.: Jefa de Bienestar" />
                </Field>
                <Field id="b-email" label="Correo corporativo" error={errors.email}>
                  <input id="b-email" type="email" className="field-input" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy('b-email', errors.email)} />
                </Field>
                <Field id="b-phone" label="Teléfono" error={errors.phone}>
                  <input id="b-phone" type="tel" inputMode="tel" className="field-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={describedBy('b-phone', errors.phone)} />
                </Field>
              </fieldset>

              <fieldset className="grid gap-5 sm:grid-cols-3">
                <legend className="ficha mb-4 border-t border-tinta/15 pt-4 w-full sm:col-span-3">Sobre el pedido</legend>
                <Field id="b-quantity" label="Cantidad estimada" optional error={errors.quantity}>
                  <input id="b-quantity" inputMode="numeric" className="field-input" value={form.quantity} onChange={(e) => set('quantity', e.target.value.replace(/\D/g, ''))} aria-invalid={!!errors.quantity} aria-describedby={describedBy('b-quantity', errors.quantity)} />
                </Field>
                <Field id="b-frequency" label="Frecuencia" optional>
                  <select id="b-frequency" className="field-input" value={form.frequency} onChange={(e) => set('frequency', e.target.value)}>
                    <option value="">Elige</option>
                    <option>Única vez</option>
                    <option>Ocasional</option>
                    <option>Mensual</option>
                    <option>Según necesidad (convenio)</option>
                  </select>
                </Field>
                <Field id="b-budgetId" label="Presupuesto por arreglo" optional>
                  <select id="b-budgetId" className="field-input" value={form.budgetId} onChange={(e) => set('budgetId', e.target.value)}>
                    <option value="">Elige</option>
                    {budgets.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="sm:col-span-3">
                  <Field id="b-message" label="Cuéntanos tu necesidad" optional error={errors.message} hint={`${form.message.length}/800`}>
                    <textarea id="b-message" rows={4} maxLength={800} className="field-input" value={form.message} onChange={(e) => set('message', e.target.value)} aria-describedby={describedBy('b-message', errors.message, 'x')} />
                  </Field>
                </div>
              </fieldset>

              <div>
                <label className="flex items-start gap-3 text-sm">
                  <input id="b-consent" type="checkbox" className="mt-1 h-4 w-4 accent-salvia-oscura" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} aria-invalid={!!errors.consent} />
                  <span>Entiendo que este es un formulario de demostración y que no genera un pedido, convenio ni compromiso comercial.</span>
                </label>
                {errors.consent && <p className="field-error" role="alert">{errors.consent}</p>}
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto">
                Preparar solicitud
              </button>
              {Object.values(errors).some(Boolean) && (
                <p className="text-sm text-terracota-oscura" role="alert">
                  Revisa los campos marcados.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </>
  )
}
