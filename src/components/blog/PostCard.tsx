import Link from "next/link";
import CoverArt from "@/components/ui/CoverArt";
import { fmtDate, readingTime } from "@/lib/utils";
import type { Post } from "@/payload-types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const coverImage =
    post.coverImage && typeof post.coverImage === "object"
      ? ((post.coverImage as any)?.sizes?.card?.url ??
        (post.coverImage as any)?.url)
      : null;

  const mins = readingTime(post.body);

  return (
    <article className="overflow-hidden rounded-card border border-border bg-white shadow-soft">
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[16/9] overflow-hidden">
          <CoverArt
            imageUrl={coverImage}
            imageAlt={post.title}
            color={(post.coverColor as any) ?? "teal"}
            sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
              post.coverColor === "navy"
                ? "bg-navy-100 text-navy-700"
                : "bg-brand-50 text-brand-700"
            }`}
          >
            {post.category}
          </span>
          {post.serie && (
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {post.serie}
            </span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display text-[1.35rem] font-bold leading-tight text-ink transition-colors hover:text-brand-700">
            {post.title}
          </h3>
        </Link>

        <p className="line-clamp-3 text-sm leading-7 text-ink-2">
          {post.excerpt}
        </p>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            <span>{fmtDate(post.date)}</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" />
            <span>{mins} min</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex h-9 items-center rounded-full border border-border px-4 font-display text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            Ler →
          </Link>
        </div>
      </div>
    </article>
  );
}
