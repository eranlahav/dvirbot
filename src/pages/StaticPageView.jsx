import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import Loading from "@/components/Loading";

export default function StaticPageView() {
  const { slug } = useParams();
  const [page, setPage] = useState(undefined);
  const [siblings, setSiblings] = useState([]);

  useEffect(() => {
    setPage(undefined);
    base44.entities.StaticPage.filter({ slug })
      .then((pages) => setPage(pages[0] || null))
      .catch(() => setPage(null));
    base44.entities.StaticPage.list("order", 20)
      .then(setSiblings)
      .catch(() => setSiblings([]));
  }, [slug]);

  if (page === undefined) return <Loading />;
  if (page === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-semibold">הדף לא נמצא</h1>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90"
        >
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  const others = siblings.filter((s) => s.slug !== slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="font-heading text-4xl font-bold sm:text-5xl">{page.title}</h1>
      {page.subtitle && <p className="mt-3 text-xl text-muted-foreground">{page.subtitle}</p>}
      <hr className="mt-6 border-border/70" />
      <div className={`reading-prose mt-6 text-lg ${page.category === "history" ? "drop-cap" : ""}`}>
        <ReactMarkdown>{page.body}</ReactMarkdown>
      </div>

      {others.length > 0 && (
        <nav className="mt-14 flex flex-wrap gap-3" aria-label="דפי מידע נוספים">
          {others.map((s) => (
            <Link
              key={s.id}
              to={`/pages/${s.slug}`}
              className="inline-flex min-h-[48px] items-center rounded-full border border-border bg-card px-5 py-2.5 font-medium transition-colors hover:border-primary/40 hover:text-primary"
            >
              {s.title}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}