import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://igrejanorio.com'

const STATIC_ROUTES = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/quem-somos', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/cultos', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.9, changeFrequency: 'daily' },
  { path: '/downloads', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/contato', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/privacidade', priority: 0.4, changeFrequency: 'yearly' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority,
  }))

  try {
    const { getPayload } = await import('@/lib/payload')
    const payload = await getPayload()
    const { docs: posts } = await payload.find({
      collection: 'posts',
      where: { published: { equals: true } },
      select: { slug: true, updatedAt: true } as any,
      limit: 500,
    })

    const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date((p as any).updatedAt ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticEntries, ...postEntries]
  } catch {
    return staticEntries
  }
}
