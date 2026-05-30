import Image from 'next/image'

// Proporção real dos SVGs: viewBox 0 0 896 300
const LOGO_ASPECT = 896 / 300

interface LogoMarkProps {
  /** Altura do logo em px. A largura é calculada pela proporção 896:300. */
  height?: number
  /** true = fundo claro → logo escuro; false = fundo escuro → logo branco */
  onLight?: boolean
  className?: string
}

export default function LogoMark({ height = 36, onLight = true, className }: LogoMarkProps) {
  const width = Math.round(height * LOGO_ASPECT)
  const src = onLight ? '/logo-IR-dark.svg' : '/logo-IR-white.svg'

  return (
    <Image
      src={src}
      alt="Igreja no Rio"
      width={width}
      height={height}
      priority
      className={className}
      style={{ display: 'block' }}
    />
  )
}
