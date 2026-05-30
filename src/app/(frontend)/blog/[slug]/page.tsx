import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { getPayload } from "@/lib/payload";
import { fmtDate, readingTime } from "@/lib/utils";
import CoverArt from "@/components/ui/CoverArt";
import PostBody from "@/components/blog/PostBody";
import type { Post } from "@/payload-types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload();
  let docs: Array<any> = [];
  try {
    const result = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug }, published: { equals: true } },
      limit: 1,
    });
    docs = result.docs;
  } catch {
    return {};
  }
  const post = docs[0];
  if (!post) return {};

  const coverImage =
    post.coverImage && typeof post.coverImage === "object"
      ? (post.coverImage as any)?.url
      : null;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date ?? undefined,
      authors: [post.author],
      ...(coverImage ? { images: [{ url: coverImage }] } : {}),
    },
  };
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const payload = await getPayload();
    const { docs } = await payload.find({
      collection: "posts",
      where: { published: { equals: true } },
      select: { slug: true } as any,
      limit: 200,
    });
    return docs.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload();

  let docs: Array<any> = [];
  try {
    const result = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug }, published: { equals: true } },
      limit: 1,
    });
    docs = result.docs;
  } catch {
    notFound();
  }

  const post = docs[0] as Post | undefined;
  if (!post) notFound();

  const coverImage =
    post.coverImage && typeof post.coverImage === "object"
      ? ((post.coverImage as any)?.sizes?.hero?.url ??
        (post.coverImage as any)?.url)
      : null;

  const mins = readingTime(post.body);

  // Fetch series navigation
  let seriesPosts: Post[] = [];
  if (post.serie) {
    try {
      const { docs: sp } = await payload.find({
        collection: "posts",
        where: { serie: { equals: post.serie }, published: { equals: true } },
        sort: "serieParte",
        limit: 20,
      });
      seriesPosts = sp as Post[];
    } catch {
      seriesPosts = [];
    }
  }

  const currentIdx = seriesPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIdx > 0 ? seriesPosts[currentIdx - 1] : null;
  const nextPost =
    currentIdx < seriesPosts.length - 1 ? seriesPosts[currentIdx + 1] : null;

  return (
    <article>
      {/* Cover */}
      <div
        style={{
          height: "clamp(300px, 40vh, 480px)",
          position: "relative",
          marginTop: "var(--nav-h)",
        }}
      >
        <CoverArt
          imageUrl={coverImage}
          imageAlt={post.title}
          color={(post.coverColor as any) ?? "teal"}
          style={{ height: "100%" }}
          sizes="100vw"
          priority
        />
      </div>

      <div
        className="container"
        style={{ maxWidth: 780, paddingBlock: "clamp(40px, 6vh, 72px)" }}
      >
        {/* Category / serie tags */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <span
            className={`tag tag-${post.coverColor === "navy" ? "navy" : "teal"}`}
          >
            {post.category}
          </span>
          {post.serie && (
            <span className="tag tag-neutral">
              {post.serie} · Parte {post.serieParte}
            </span>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 5vw, 52px)",
            fontWeight: 800,
            lineHeight: 1.06,
            letterSpacing: "-0.025em",
            textWrap: "balance",
            marginBottom: 20,
          }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "var(--muted)",
            fontSize: 14,
            marginBottom: 40,
            paddingBottom: 32,
            borderBottom: "1px solid var(--border)",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>
            {post.author}
          </span>
          <span>·</span>
          <span>{fmtDate(post.date, true)}</span>
          <span>·</span>
          <span>{mins} min de leitura</span>
        </div>

        {/* Body */}
        <PostBody content={post.body as any} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 48 }}
          >
            {post.tags.map((t: { tag?: string | null; id?: string | null }) => (
              <span key={t.tag} className="tag tag-neutral">
                {t.tag}
              </span>
            ))}
          </div>
        )}

        {/* Series navigation */}
        {seriesPosts.length > 1 && (
          <div
            style={{
              marginTop: 48,
              padding: "24px",
              background: "var(--bg)",
              borderRadius: "var(--r-xl)",
              border: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              Série: {post.serie}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="btn btn-outline btn-sm"
                >
                  ← Parte {prevPost.serieParte}: {prevPost.title}
                </Link>
              ) : (
                <span />
              )}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="btn btn-primary btn-sm"
                >
                  Parte {nextPost.serieParte}: {nextPost.title} →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Back to blog */}
        <div style={{ marginTop: 48 }}>
          <Link href="/blog" className="btn btn-ghost btn-sm">
            ← Voltar para o Blog
          </Link>
        </div>
      </div>
    </article>
  );
}
