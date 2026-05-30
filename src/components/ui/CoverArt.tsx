import Image from 'next/image'

type CoverColor = 'teal' | 'navy' | 'sand'

interface CoverArtProps {
  imageUrl?: string | null
  imageAlt?: string
  color?: CoverColor
  className?: string
  style?: React.CSSProperties
  sizes?: string
  priority?: boolean
}

export default function CoverArt({
  imageUrl,
  imageAlt = '',
  color = 'teal',
  className = '',
  style,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: CoverArtProps) {
  return (
    <div
      className={`cover-art cover-art-${color} ${className}`}
      style={{ width: '100%', height: '100%', ...style }}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      )}
    </div>
  )
}
