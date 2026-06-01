import Link from 'next/link'
import CoverArt from '@/components/ui/CoverArt'
import { fmtDate, readingTime } from '@/lib/utils'
import type { Post } from '@/payload-types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const coverImage =
    post.coverImage && typeof post.coverImage === 'object'
      ? (post.coverImage as any)?.sizes?.card?.url ?? (post.coverImage as any)?.url
      : null

  const mins = readingTime(post.body)

  return (
    <article className="post-card">
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="post-card-cover">
          <CoverArt
            imageUrl={coverImage}
            imageAlt={post.title}
            color={(post.coverColor as any) ?? 'teal'}
            sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="post-card-body">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: "0.75rem" }} className={`tag tag-${post.coverColor === 'navy' ? 'navy' : 'teal'}`}>
            {post.category}
          </span>
          {post.serie && (
            <span style={{ fontSize: "0.75rem" }} className="tag tag-neutral">{post.serie}</span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="post-card-title">{post.title}</h3>
        </Link>

        <p className="post-card-excerpt">{post.excerpt}</p>

        <div className="post-card-footer">
          <div className="post-card-meta">
            <span>{post.author}</span>
            <span className="post-card-meta-dot" />
            <span>{fmtDate(post.date)}</span>
            <span className="post-card-meta-dot" />
            <span>{mins} min</span>
          </div>
          <Link href={`/blog/${post.slug}`} className="btn btn-ghost btn-sm">
            Ler →
          </Link>
        </div>
      </div>
    </article>
  )
}
