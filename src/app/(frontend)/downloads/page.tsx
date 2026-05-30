import type { Metadata } from "next";
import { getPayload } from "@/lib/payload";
import DownloadCard from "@/components/ui/DownloadCard";
import type { Download } from "@/payload-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Pregações em áudio, PDFs de estudo e slides dos grupos caseiros da Igreja no Rio.",
  openGraph: { title: "Downloads — Igreja no Rio" },
};

export default async function DownloadsPage() {
  const payload = await getPayload();
  const downloadsResult = await Promise.allSettled([
    payload.find({
      collection: "downloads",
      sort: "-date",
      limit: 100,
    }),
  ]);

  const downloads =
    downloadsResult[0].status === "fulfilled"
      ? downloadsResult[0].value.docs
      : [];

  // Group by category
  const groups = downloads.reduce<Record<string, Download[]>>((acc, dl) => {
    const cat = (dl as Download).category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dl as Download);
    return acc;
  }, {});

  const categoryOrder = [
    "Pregações",
    "Estudos",
    "Grupos Caseiros",
    "Devocionais",
  ];
  const sortedCategories = [
    ...categoryOrder.filter((c) => groups[c]),
    ...Object.keys(groups).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <>
      <div
        className="page-hero"
        style={{ paddingTop: "calc(var(--nav-h) + 48px)" }}
      >
        <div className="container">
          <p className="section-label">Materiais</p>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Downloads
          </h1>
          <p className="section-desc" style={{ marginTop: 16 }}>
            Áudios das pregações, apostilas de estudo, roteiros de grupos
            caseiros e devocionais para levar para casa.
          </p>
        </div>
      </div>

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
            <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
              {sortedCategories.map((cat) => (
                <section key={cat}>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 700,
                      marginBottom: 16,
                      paddingBottom: 12,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {cat}
                    <span
                      style={{
                        marginInlineStart: 8,
                        fontWeight: 400,
                        fontSize: 14,
                        color: "var(--muted)",
                      }}
                    >
                      ({groups[cat].length})
                    </span>
                  </h2>
                  <div className="downloads-list">
                    {groups[cat].map((dl) => (
                      <DownloadCard key={dl.id} item={dl} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
