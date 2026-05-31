import type { Metadata } from "next";
import { getPayload } from "@/lib/payload";
import PostCard from "@/components/blog/PostCard";
import BlogFilters from "@/components/blog/BlogFilters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Devocionais, estudos em série e reflexões da Igreja no Rio.",
  openGraph: { title: "Blog — Igreja no Rio" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; serie?: string }>;
}) {
  const { category, serie } = await searchParams;
  const payload = await getPayload();

  const where: Record<string, any> = { published: { equals: true } };
  if (category) where.category = { equals: category };
  if (serie) where.serie = { equals: serie };

  const [postsResult, allPostsResult] = await Promise.allSettled([
    payload.find({
      collection: "posts",
      where,
      sort: "-date",
      limit: 50,
    }),
    payload.find({
      collection: "posts",
      where: { published: { equals: true } },
      select: { serie: true, category: true } as any,
      limit: 200,
    }),
  ]);

  const posts =
    postsResult.status === "fulfilled" ? postsResult.value.docs : [];
  const allPosts =
    allPostsResult.status === "fulfilled" ? allPostsResult.value.docs : [];

  const series = [
    ...new Set(allPosts.map((p) => p.serie).filter(Boolean)),
  ] as string[];
  const categories = ["Devocional", "Estudo"];

  return (
    <>
      <div className="page-hero page-hero-offset">
        <div className="container page-hero-content">
          <p className="section-label">Blog</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Devocionais e Estudos
          </h1>
          <p className="section-desc page-intro-copy">
            Reflexões semanais, estudos em série e palavras para a caminhada.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <BlogFilters
            categories={categories}
            series={series}
            activeCategory={category}
            activeSerie={serie}
          />

          {posts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 0",
                color: "var(--muted)",
              }}
            >
              <p style={{ fontSize: 18 }}>Nenhum post encontrado.</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post as any} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
