// Hero "Acolhedora" — navy hero escuro com boas-vindas calorosas
import Link from 'next/link'

export default function HeroV1() {
  return (
    <section className="hero-v1">
      {/* Background gradient — troque por <Image> quando tiverem foto real */}
      <div
        className="hero-v1-bg"
        style={{
          background: 'linear-gradient(160deg, var(--navy-700) 0%, var(--navy-900) 60%)',
        }}
      />
      <div className="hero-v1-overlay" />

      <div className="container">
        <div className="hero-v1-content">
          <p className="hero-v1-eyebrow">Santíssimo · Rio de Janeiro</p>

          <h1 className="hero-v1-title">
            Você já foi<br />encontrado.
          </h1>

          <p className="hero-v1-subtitle">
            Somos uma família que vive, celebra e serve juntos no coração do Rio.
            Toda semana você é bem-vindo aqui — seja na sua primeira visita ou na décima vez.
          </p>

          <div className="hero-v1-actions">
            <Link href="/cultos" className="btn btn-primary btn-lg">
              Venha nos conhecer
            </Link>
            <Link href="/quem-somos" className="btn btn-white btn-lg">
              Quem somos
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
