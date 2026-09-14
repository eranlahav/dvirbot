import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import BulletinCard from "@/components/BulletinCard";
import Loading from "@/components/Loading";

export default function Bulletins() {
  const [bulletins, setBulletins] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    base44.entities.Bulletin.list("-issue_number", 200).then(setBulletins).catch(() => setBulletins([]));
  }, []);

  const filtered = useMemo(() => {
    if (!bulletins) return [];
    const q = query.trim();
    if (!q) return bulletins;
    return bulletins.filter(
      (b) => (b.title && b.title.includes(q)) || String(b.issue_number).includes(q)
    );
  }, [bulletins, query]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="font-heading text-4xl font-bold">ארכיון העלונים</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        העלון השבועי של הקיבוץ — כל גיליון חדש עולה לכאן אוטומטית, מיד כשהוא יוצא
      </p>

      <div className="relative mt-6">
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
          className="min-h-[52px] rounded-xl border-border/70 bg-card pr-12 text-lg"
          aria-label="חיפוש עלונים"
        />
      </div>

      {bulletins === null ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-center text-lg text-muted-foreground">
          {query ? "לא נמצאו עלונים מתאימים לחיפוש" : "הארכיון עוד ריק — העלון הראשון יגיע בקרוב"}
        </p>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BulletinCard key={b.id} bulletin={b} />
          ))}
        </div>
      )}
    </div>
  );
}