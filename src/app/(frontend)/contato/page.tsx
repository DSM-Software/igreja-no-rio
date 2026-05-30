import type { Metadata } from 'next'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { getPayload } from '@/lib/payload'
import EventCard from '@/components/ui/EventCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Igreja no Rio. Endereço, telefone e agenda de eventos em Santíssimo, RJ.',
  openGraph: { title: 'Contato — Igreja no Rio' },
}

export default async function ContatoPage() {
  const payload = await getPayload()
  const { docs: events } = await payload.find({
    collection: 'events',
    sort: 'date',
    limit: 8,
  })

  return (
    <>
      <div className="page-hero" style={{ paddingTop: 'calc(var(--nav-h) + 48px)' }}>
        <div className="container">
          <p className="section-label">Fale conosco</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
            Ficamos felizes em te ouvir
          </h1>
          <p className="section-desc" style={{ marginTop: 16 }}>
            Tem alguma dúvida, quer visitar ou saber mais sobre os grupos caseiros? Chama a gente!
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          {/* Contact info */}
          <div>
            <h2 className="section-title" style={{ fontSize: 28 }}>Informações</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 32 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon icon="material-symbols:location-on-outline-rounded" style={{ fontSize: 22, color: 'var(--teal-600)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Endereço</p>
                  <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.7 }}>
                    Rua Ivan Pessoa, 341<br />
                    Santíssimo — Rio de Janeiro, RJ
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon icon="material-symbols:mail-outline-rounded" style={{ fontSize: 22, color: 'var(--teal-600)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>E-mail</p>
                  <a href="mailto:contato@igrejanorio.com" style={{ color: 'var(--accent)', fontSize: 14 }}>
                    contato@igrejanorio.com
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon icon="material-symbols:schedule-outline-rounded" style={{ fontSize: 22, color: 'var(--teal-600)' }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: 4 }}>Cultos</p>
                  <p style={{ color: 'var(--ink-2)', fontSize: 14, lineHeight: 1.7 }}>
                    Domingos às 10h00<br />
                    Grupos caseiros — quartas às 19h30
                  </p>
                </div>
              </div>
            </div>

            {/* Simple contact form placeholder */}
            <div
              style={{
                marginTop: 40,
                padding: 28,
                background: 'var(--bg)',
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--border)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
                Envie uma mensagem
              </h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Nome</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Mensagem</label>
                  <textarea
                    placeholder="Como posso te ajudar?"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--r-md)',
                      fontSize: 14,
                      fontFamily: 'var(--font-body)',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-md" style={{ alignSelf: 'flex-start' }}>
                  Enviar mensagem
                </button>
              </form>
            </div>
          </div>

          {/* Events agenda */}
          <div>
            <h2 className="section-title" style={{ fontSize: 28 }}>Próximos eventos</h2>
            <p className="section-desc" style={{ marginBottom: 32 }}>
              Venha em qualquer um dos nossos encontros.
            </p>
            {events.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>Nenhum evento cadastrado.</p>
            ) : (
              <div className="events-list">
                {events.map((ev) => (
                  <EventCard key={ev.id} event={ev as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
