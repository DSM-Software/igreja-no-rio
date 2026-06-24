import type { Metadata } from "next";
import { getPayload } from "@/lib/payload";
import { slugify } from "@/lib/utils";
import DownloadCategoryNav from "@/components/ui/DownloadCategoryNav";
import DownloadCategorySection from "@/components/ui/DownloadCategorySection";
import type { Download } from "@/payload-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Pregações em áudio, PDFs de estudo e slides dos grupos caseiros da Igreja no Rio.",
};

const CATEGORY_ORDER = [
  "Pregações",
  "Estudos",
  "Grupos Caseiros",
  "Devocionais",
] as const;

export default async function DownloadsPage() {
  const payload = await getPayload();
  let downloads: Download[] = [];

  try {
    const result = await payload.find({
      collection: "downloads",
      sort: "-date",
      limit: 100,
    });
    downloads = result.docs as Download[];
  } catch {
    downloads = [];
  }

  const groups = downloads.reduce<Record<string, Download[]>>((acc, dl) => {
    const cat = dl.category?.trim() || "Outros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dl);
    return acc;
  }, {});

  const sortedCategories = [
    ...CATEGORY_ORDER.filter((category) => groups[category]),
    ...Object.keys(groups).filter(
      (category) =>
        !CATEGORY_ORDER.includes(category as (typeof CATEGORY_ORDER)[number]),
    ),
  ];

  return (
    <>
      <div className="page-hero page-hero-offset">
        <div className="container page-hero-content">
          <p className="section-label">Materiais</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Downloads
          </h1>
          <p className="section-desc page-intro-copy">
            Áudios das pregações, apostilas de estudo, roteiros de grupos
            caseiros e devocionais para levar para casa.
          </p>
        </div>
      </div>

      {downloads.length > 0 && (
        <DownloadCategoryNav categories={sortedCategories} />
      )}

      <section className="section">
        <div className="container">
          {downloads.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 0",
                color: "var(--muted)",
              }}
            >
              <p>Nenhum material disponível ainda.</p>
            </div>
          ) : (
            <div className="section-stack" style={{ gap: 56 }}>
              {sortedCategories.map((cat) => (
                <DownloadCategorySection
                  key={cat}
                  title={cat}
                  items={groups[cat]}
                  id={slugify(cat)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
