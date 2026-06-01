import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Saiba como a Igreja no Rio trata dados pessoais em seus canais institucionais e como exercer seus direitos.',
  openGraph: { title: 'Política de Privacidade — Igreja no Rio' },
}

const sections = [
  {
    title: '1. Quem controla estes dados',
    body: [
      'A Igreja no Rio e a responsavel pelos dados pessoais tratados neste site institucional.',
      'Para assuntos de privacidade, exercicio de direitos e atualizacao de informacoes, use o canal contato@igrejanorio.com.',
    ],
  },
  {
    title: '2. Quais dados podem ser tratados',
    body: [
      'Quando voce entra em contato pelos canais oficiais da igreja, podemos tratar dados como nome, e-mail, telefone e o conteudo da sua mensagem.',
      'Tambem podemos receber dados tecnicos basicos de acesso e navegacao necessarios para manter o site disponivel e seguro, como logs de acesso, endereco IP e informacoes do navegador.',
    ],
  },
  {
    title: '3. Para que usamos esses dados',
    body: [
      'Os dados de contato sao usados para responder duvidas, orientar visitantes, acompanhar pedidos relacionados a grupos caseiros, eventos e atividades da igreja.',
      'Os dados tecnicos sao usados para seguranca, prevencao de abuso, diagnostico de erros e operacao regular do site e do CMS.',
    ],
  },
  {
    title: '4. Base legal e compartilhamento',
    body: [
      'O tratamento ocorre conforme a finalidade do contato, o interesse legitimo na seguranca e operacao do site e, quando aplicavel, o cumprimento de obrigacoes legais.',
      'Nao comercializamos dados pessoais. Dados podem ser processados por provedores de hospedagem, banco de dados e armazenamento estritamente para viabilizar a operacao do site.',
    ],
  },
  {
    title: '5. Retencao e protecao',
    body: [
      'Mantemos dados pessoais apenas pelo tempo necessario para cumprir a finalidade do atendimento, obrigações legais e requisitos de seguranca.',
      'Adotamos medidas tecnicas e administrativas razoaveis para proteger o site e limitar acessos indevidos aos dados.',
    ],
  },
  {
    title: '6. Seus direitos',
    body: [
      'Voce pode solicitar confirmacao de tratamento, acesso, correcao, atualizacao, anonimização, exclusao quando cabivel e outras medidas previstas na LGPD.',
      'Para exercer esses direitos, entre em contato pelo e-mail contato@igrejanorio.com e descreva seu pedido com o maximo de contexto possivel.',
    ],
  },
  {
    title: '7. Atualizacoes desta politica',
    body: [
      'Esta politica pode ser revisada para refletir mudancas operacionais, legais ou de seguranca. A versao publicada nesta pagina e a vigente para o site institucional.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <div className="page-hero page-hero-offset">
        <div className="container page-hero-content">
          <p className="section-label">Privacidade</p>
          <h1 className="section-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>
            Política de Privacidade
          </h1>
          <p className="section-desc page-intro-copy">
            Esta página resume como tratamos dados pessoais nos canais institucionais da Igreja no Rio e como voce pode falar conosco sobre privacidade.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="surface-card surface-card-muted" style={{ marginBottom: 32 }}>
            <p className="supporting-copy" style={{ margin: 0 }}>
              Se voce tiver qualquer duvida sobre esta politica ou quiser exercer direitos relacionados aos seus dados pessoais, escreva para <a href="mailto:contato@igrejanorio.com" style={{ color: 'var(--accent)' }}>contato@igrejanorio.com</a>.
            </p>
          </div>

          <div className="section-stack" style={{ gap: 32 }}>
            {sections.map((section) => (
              <section key={section.title} className="surface-card">
                <h2 className="section-title section-block-title" style={{ fontSize: 24 }}>
                  {section.title}
                </h2>
                <div className="section-stack" style={{ gap: 12 }}>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="supporting-copy" style={{ margin: 0 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}