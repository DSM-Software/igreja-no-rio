import type { Metadata } from 'next'
import { ManagePreferencesButton } from '@/components/consent/ManagePreferencesButton'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Saiba como a Igreja no Rio trata dados pessoais em seus canais institucionais e como exercer seus direitos.',
}

const sections = [
  {
    title: '1. Quem controla estes dados',
    body: [
      'A Igreja no Rio é a responsável pelos dados pessoais tratados neste site institucional.',
      'Para assuntos de privacidade, exercício de direitos e atualização de informações, use o canal contato@igrejanorio.com.',
    ],
  },
  {
    title: '2. Quais dados podem ser tratados',
    body: [
      'Quando você entra em contato pelos canais oficiais da igreja, podemos tratar dados como nome, e-mail, telefone e o conteúdo da sua mensagem.',
      'Também podemos receber dados técnicos básicos de acesso e navegação necessários para manter o site disponível e seguro, como logs de acesso, endereço IP e informações do navegador.',
      'Mediante seu consentimento, coletamos também dados agregados e pseudonimizados de navegação (páginas visitadas, origem do tráfego, dispositivo) para entender como o site é usado e melhorar a experiência.',
    ],
  },
  {
    title: '3. Para que usamos esses dados',
    body: [
      'Os dados de contato são usados para responder dúvidas, orientar visitantes, acompanhar pedidos relacionados a grupos caseiros, eventos e atividades da igreja.',
      'Os dados técnicos são usados para segurança, prevenção de abuso, diagnóstico de erros e operação regular do site e do CMS.',
      'Os dados de navegação coletados com seu consentimento são usados exclusivamente para medir audiência, melhorar o conteúdo do site e medir o alcance das nossas publicações. Você pode aceitar, recusar ou ajustar essa coleta a qualquer momento na seção "Gerenciar preferências de cookies" desta página.',
    ],
  },
  {
    title: '4. Base legal e compartilhamento',
    body: [
      'O tratamento ocorre conforme a finalidade do contato, o interesse legítimo na segurança e operação do site e, quando aplicável, o cumprimento de obrigações legais.',
      'Não comercializamos dados pessoais. Dados podem ser processados por provedores de hospedagem, banco de dados e armazenamento estritamente para viabilizar a operação do site.',
    ],
  },
  {
    title: '5. Retenção e proteção',
    body: [
      'Mantemos dados pessoais apenas pelo tempo necessário para cumprir a finalidade do atendimento, obrigações legais e requisitos de segurança.',
      'Adotamos medidas técnicas e administrativas razoáveis para proteger o site e limitar acessos indevidos aos dados.',
    ],
  },
  {
    title: '6. Seus direitos',
    body: [
      'Você pode solicitar confirmação de tratamento, acesso, correção, atualização, anonimização, exclusão quando cabível e outras medidas previstas na LGPD.',
      'Para exercer esses direitos, entre em contato pelo e-mail contato@igrejanorio.com e descreva seu pedido com o máximo de contexto possível.',
    ],
  },
  {
    title: '7. Atualizações desta política',
    body: [
      'Esta política pode ser revisada para refletir mudanças operacionais, legais ou de segurança. A versão publicada nesta página é a vigente para o site institucional.',
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
            Esta página resume como tratamos dados pessoais nos canais institucionais da Igreja no Rio e como você pode falar conosco sobre privacidade.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="surface-card surface-card-muted" style={{ marginBottom: 32 }}>
            <p className="supporting-copy" style={{ margin: 0 }}>
              Se você tiver qualquer dúvida sobre esta política ou quiser exercer direitos relacionados aos seus dados pessoais, escreva para <a href="mailto:contato@igrejanorio.com" style={{ color: 'var(--accent)' }}>contato@igrejanorio.com</a>.
            </p>
          </div>

          <section className="surface-card" style={{ marginBottom: 32 }}>
            <h2 className="section-title section-block-title" style={{ fontSize: 24 }}>
              Gerenciar preferências de cookies
            </h2>
            <div className="section-stack" style={{ gap: 12 }}>
              <p className="supporting-copy" style={{ margin: 0 }}>
                Você pode aceitar, recusar ou ajustar a qualquer momento o uso
                de cookies analíticos e de marketing neste site. A decisão fica
                gravada apenas no seu navegador e é válida por 12 meses.
              </p>
              <p className="supporting-copy" style={{ margin: 0 }}>
                Use o botão abaixo para reabrir o painel de preferências e atualizar
                sua escolha. Categorias essenciais (necessárias ao funcionamento
                básico do site) não envolvem rastreamento e não podem ser
                desativadas.
              </p>
              <div style={{ marginTop: 8 }}>
                <ManagePreferencesButton />
              </div>
            </div>
          </section>

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