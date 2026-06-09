import type { Metadata } from "next";
import { getPayload } from "@/lib/payload";
import PostCard from "@/components/blog/PostCard";
import BlogFilters from "@/components/blog/BlogFilters";
import Pagination from "@/components/blog/Pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Devocionais, estudos em série e reflexões da Igreja no Rio.",
  openGraph: { title: "Blog — Igreja no Rio" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; serie?: string; page?: string }>;
}) {
  const { category, serie, page: pageParam } = await searchParams;
  const pageNumber = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const payload = await getPayload();

  const where: Record<string, any> = { published: { equals: true } };
  if (category) where.category = { equals: category };
  if (serie) where.serie = { equals: serie };

  const [postsResult, allPostsResult] = await Promise.allSettled([
    payload.find({
      collection: "posts",
      where,
      sort: "-date",
      limit: 12,
      page: pageNumber,
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
  const totalPages =
    postsResult.status === "fulfilled" ? postsResult.value.totalPages : 1;
  const allPosts =
    allPostsResult.status === "fulfilled" ? allPostsResult.value.docs : [];

  const series = [
    ...new Set(allPosts.map((p) => p.serie).filter(Boolean)),
  ] as string[];
  const categories = ["Devocional", "Estudo"];

  return (
    <>
      <div className="mx-auto w-full max-w-content px-4 pt-36 md:px-8">
        <div className="max-w-3xl">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Blog
          </p>
          <h1 className="mt-2 font-display text-[clamp(34px,5vw,56px)] font-bold tracking-[-0.02em] text-ink">
            Devocionais e Estudos
          </h1>
          <p className="mt-4 text-base leading-8 text-ink-2">
            Reflexões semanais, estudos em série e palavras para a caminhada.
          </p>
        </div>
      </div>

      <section className="py-14">
        <div className="mx-auto w-full max-w-content px-4 md:px-8">
          <BlogFilters
            categories={categories}
            series={series}
            activeCategory={category}
            activeSerie={serie}
          />

          {posts.length === 0 ? (
            <div className="py-16 text-center text-muted">
              <p className="text-lg">Nenhum post encontrado.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post as any} />
                ))}
              </div>
              <Pagination
                page={pageNumber}
                totalPages={totalPages}
                category={category}
                serie={serie}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
