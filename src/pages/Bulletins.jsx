import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import BulletinCard from "@/components/BulletinCard";
import Loading from "@/components/Loading";

export default function Bulletins() {
  const [bulletins, setBulletins] = useState(null);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");

  useEffect(() => {
    base44.entities.Bulletin.list("-issue_number", 300).then(setBulletins).catch(() => setBulletins([]));
  }, []);

  const years = useMemo(() => {
    if (!bulletins) return [];
    const set = new Set(
      bulletins
        .map((b) => {
          const d = new Date(b.publish_date);
          return Number.isNaN(d.getFullYear()) ? null : d.getFullYear();
        })
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => b - a);
  }, [bulletins]);

  const filtered = useMemo(() => {
    if (!bulletins) return [];
    let list = bulletins;
    if (year !== "all") {
      list = list.filter((b) => new Date(b.publish_date).getFullYear() === year);
    }
    const q = query.trim();
    if (q) {
      list = list.filter((b) => (b.title && b.title.includes(q)) || String(b.issue_number).includes(q));
    }
    return list;
  }, [bulletins, query, year]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-3xl font-bold">עלונים</h1>
      <p className="mt-2 text-muted-foreground">
        כל הגיליונות של העלון השבועי — כל גיליון חדש עולה לכאן אוטומטית, מיד כשהוא יוצא
      </p>

      <div className="relative mt-5">
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
          aria-hidden="true"
        />
        <Input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש לפי כותרת או מספר גיליון…"
          className="min-h-[50px] rounded-full border-border/70 bg-card pr-12"
          aria-label="חיפוש עלונים"
        />
      </div>

      {years.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setYear("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              year === "all" ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
            }`}
          >
            הכל
          </button>
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                year === y ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {bulletins === null ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-lg text-muted-foreground">
          {query || year !== "all" ? "לא נמצאו עלונים מתאימים" : "הארכיון עוד ריק — העלון הראשון יגיע בקרוב"}
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {filtered.map((b, i) => (
            <BulletinCard key={b.id} bulletin={b} emphasize={i === 0 && year === "all" && !query} />
          ))}
        </div>
      )}
    </div>
  );
}
