import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Calendar, Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Loading from "@/components/Loading";
import { formatDateHe } from "@/lib/formatDate";

export default function BulletinDetail() {
  const { id } = useParams();
  const [bulletin, setBulletin] = useState(undefined);

  useEffect(() => {
    setBulletin(undefined);
    base44.entities.Bulletin.get(id).then(setBulletin).catch(() => setBulletin(null));
  }, [id]);

  if (bulletin === undefined) return <Loading label="טוען עלון…" />;
  if (bulletin === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-heading text-3xl font-semibold">העלון לא נמצא</h1>
        <p className="mt-3 text-muted-foreground">ייתכן שהקישור אינו תקין</p>
        <Link
          to="/bulletins"
          className="mt-6 inline-flex min-h-[48px] items-center rounded-lg bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90"
        >
          חזרה לארכיון
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link
        to="/bulletins"
        className="inline-flex min-h-[48px] items-center gap-1.5 font-medium text-accent hover:underline"
      >
        <ArrowRight size={18} aria-hidden="true" />
        חזרה לארכיון
      </Link>

      <header className="mt-4">
        <p className="font-heading text-5xl font-bold leading-none text-accent">מס&rsquo; {bulletin.issue_number}</p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{bulletin.title}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-lg text-muted-foreground">
          <Calendar size={18} aria-hidden="true" />
          <time dateTime={bulletin.publish_date}>{formatDateHe(bulletin.publish_date)}</time>
        </p>
      </header>

      <div className="mt-6">
        {bulletin.pdf_url ? (
          <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <iframe
              src={bulletin.pdf_url}
              title={bulletin.title}
              className="h-[75vh] min-h-[420px] w-full"
              allow="autoplay"
            />
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-lg text-muted-foreground">
            קובץ העלון יעלה לכאן בקרוב
          </p>
        )}
      </div>

      {bulletin.download_url && (
        <a
          href={bulletin.download_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-[52px] items-center gap-2.5 rounded-xl bg-accent px-6 text-lg font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
        >
          <Download size={22} aria-hidden="true" />
          הורדת העלון (PDF)
        </a>
      )}
    </div>
  );
}