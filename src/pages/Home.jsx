import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Images, Landmark, Newspaper, Phone, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import UpdateCard from "@/components/UpdateCard";
import Loading from "@/components/Loading";
import { formatDateHe } from "@/lib/formatDate";

const HERO_IMAGE =
  "https://media.base44.com/images/public/6aa80c4614688676db34c372/a10f43821_generated_651c7008.jpg";

const QUICK_LINKS = [
  { label: "היסטוריה", desc: "סיפור הקיבוץ", path: "/pages/history", icon: Landmark },
  { label: "מבנה הקהילה", desc: "ועדות ומזכירות", path: "/pages/community", icon: Users },
  { label: "גלריית תמונות", desc: "רגעים מהקיבוץ", path: "/gallery", icon: Images },
  { label: "צור קשר", desc: "טלפון וכתובת", path: "/pages/contact", icon: Phone },
];

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
    base44.entities.Update.list("-post_date", 3)
      .then(setUpdates)
      .catch(() => setUpdates([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-5">
      <section className="relative overflow-hidden rounded-2xl shadow-md" aria-label="פתיח">
        <Image src={HERO_IMAGE} alt="קיבוץ דביר בשעת הזהב" className="h-72 w-full sm:h-96" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <h1 className="font-heading text-4xl font-bold text-primary-foreground drop-shadow-sm sm:text-5xl">
            {getGreeting()}
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/90">
            כל מה שקורה בקיבוץ — עלונים, עדכונים, תמונות ומידע, במקום אחד
          </p>
        </div>
      </section>

      {latestBulletin && (
        <Link
          to={`/bulletins/${latestBulletin.id}`}
          className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-card p-5 shadow-sm ring-1 ring-primary/15 transition-shadow hover:shadow-md"
        >
          <span className="flex min-w-0 items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10">
              <Newspaper className="text-accent" size={26} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-muted-foreground">העלון האחרון</span>
              <span className="block truncate font-heading text-2xl font-semibold text-primary">
                {latestBulletin.title}
              </span>
              <span className="block text-sm text-muted-foreground">
                {formatDateHe(latestBulletin.publish_date)}
              </span>
            </span>
          </span>
          <ArrowLeft className="shrink-0 text-accent" size={24} aria-hidden="true" />
        </Link>
      )}

      <section className="mt-10" aria-labelledby="updates-heading">
        <div className="flex items-center justify-between gap-3">
          <h2 id="updates-heading" className="font-heading text-3xl font-semibold">
            עדכונים אחרונים
          </h2>
          <Link
            to="/updates"
            className="inline-flex min-h-[48px] items-center gap-1.5 font-medium text-accent hover:underline"
          >
            כל העדכונים
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
        {updates === null ? (
          <Loading />
        ) : updates.length === 0 ? (
          <p className="mt-4 text-muted-foreground">אין עדכונים חדשים כרגע</p>
        ) : (
          <div className="mt-5">
            {updates.map((u, i) => (
              <React.Fragment key={u.id}>
                {i > 0 && <hr className="my-6 border-border/70" />}
                <UpdateCard update={u} />
              </React.Fragment>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12" aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading" className="font-heading text-3xl font-semibold">
          הכירו את דביר
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {QUICK_LINKS.map(({ label, desc, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="flex min-h-[112px] flex-col items-start gap-2 rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="text-primary" size={22} aria-hidden="true" />
              </span>
              <span className="font-heading text-xl font-semibold text-primary">{label}</span>
              <span className="text-sm text-muted-foreground">{desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}