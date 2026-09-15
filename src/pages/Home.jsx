import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Newspaper } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import Loading from "@/components/Loading";
import { formatDateHe } from "@/lib/formatDate";

// TODO: swap for a real photo of the kibbutz once one is uploaded to the
// Base44 media library — this is still the original placeholder asset.
const HERO_IMAGE =
  "https://media.base44.com/images/public/6aa80c4614688676db34c372/a10f43821_generated_651c7008.jpg";

function getGreeting() {
  const day = new Date().getDay();
  if (day === 6) return "שבת שלום, דביר";
  if (day === 5) return "ערב שבת שלום, דביר";
  return "שלום דביר";
}

export default function Home() {
  const [latestBulletin, setLatestBulletin] = useState(null);
  const [updates, setUpdates] = useState(null);

  useEffect(() => {
    base44.entities.Bulletin.list("-issue_number", 1)
      .then((items) => setLatestBulletin(items[0] || null))
      .catch(() => setLatestBulletin(null));
    base44.entities.Update.list("-post_date", 4)
      .then(setUpdates)
      .catch(() => setUpdates([]));
  }, []);

  return (
    <div>
      {/* Hero — full-bleed, flush with the top of the page */}
      <section className="relative h-72 overflow-hidden rounded-b-[2rem] sm:h-96" aria-label="פתיח">
        <Image
          src={HERO_IMAGE}
          alt="קיבוץ דביר"
          fittingType="fill"
          focalPointY={0.45}
          className="h-full w-full scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <h1 className="font-heading text-4xl font-bold text-white drop-shadow-sm sm:text-5xl">
            {getGreeting()}
          </h1>
          <p className="mt-1 max-w-md text-lg text-white/90">
            עלונים, עדכונים ותמונות מהקיבוץ — הכל במקום אחד
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-5">
      {/* Latest bulletin — simple icon card, floating over the hero */}
      {latestBulletin && (
        <Link
          to={`/bulletins/${latestBulletin.id}`}
          className="relative -mt-7 mx-3 flex items-center gap-4 rounded-3xl bg-card p-4 shadow-[var(--shadow-float-lg)] ring-1 ring-border/50 transition-shadow hover:shadow-md sm:mx-6"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/80 to-primary">
            <Newspaper className="text-white" size={24} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs text-muted-foreground">
              העלון האחרון · {formatDateHe(latestBulletin.publish_date)}
            </span>
            <span className="block truncate font-heading text-lg font-bold text-foreground">
              {latestBulletin.title}
            </span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <ArrowLeft className="text-primary" size={16} aria-hidden="true" />
          </span>
        </Link>
      )}

      {/* Recent updates — wide rectangle cards that hint at horizontal scroll */}
      <section className="mt-8" aria-labelledby="updates-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="updates-heading" className="font-heading text-xl font-bold">
            עדכונים אחרונים
          </h2>
          <Link to="/updates" className="text-sm font-semibold text-primary hover:underline">
            הכל
          </Link>
        </div>
        {updates === null ? (
          <Loading />
        ) : updates.length === 0 ? (
          <p className="mt-4 text-muted-foreground">אין עדכונים חדשים כרגע</p>
        ) : (
          <div className="-mx-4 mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
            {updates.map((u) => (
              <Link
                key={u.id}
                to="/updates"
                className="relative h-40 w-64 shrink-0 snap-start overflow-hidden rounded-3xl shadow-[var(--shadow-float)]"
              >
                {u.images && u.images.length > 0 ? (
                  <Image src={u.images[0]} alt="" fittingType="fill" className="h-full w-full" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary/70 to-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-3">
                  <p className="text-xs text-white/80">{formatDateHe(u.post_date)}</p>
                  <p className="mt-0.5 line-clamp-2 font-heading text-sm font-bold text-white">{u.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* AI assistant entry point */}
      <section className="mt-8">
        <Link
          to="/chat"
          className="cta-gradient flex items-center justify-center gap-2.5 rounded-full py-4 text-lg font-bold text-white shadow-[var(--shadow-float)] transition-opacity hover:opacity-95"
        >
          <MessageCircle size={20} aria-hidden="true" />
          דברו איתי
        </Link>
      </section>
      </div>
    </div>
  );
}