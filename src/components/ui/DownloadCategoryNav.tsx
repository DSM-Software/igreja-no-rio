import { slugify } from '@/lib/utils'

interface DownloadCategoryNavProps {
  categories: string[]
}

export default function DownloadCategoryNav({ categories }: DownloadCategoryNavProps) {
  if (categories.length === 0) return null

  return (
    <nav className="downloads-category-nav" aria-label="Categorias de downloads">
      <div className="downloads-category-nav-inner">
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#${slugify(cat)}`}
            className="downloads-category-nav-link"
          >
            {cat}
          </a>
        ))}
      </div>
    </nav>
  )
}
