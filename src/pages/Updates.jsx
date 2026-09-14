import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import UpdateCard from "@/components/UpdateCard";
import Loading from "@/components/Loading";

export default function Updates() {
  const [updates, setUpdates] = useState(null);

  useEffect(() => {
    base44.entities.Update.list("-post_date", 100).then(setUpdates).catch(() => setUpdates([]));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="font-heading text-3xl font-bold">עדכונים</h1>
      <p className="mt-2 text-muted-foreground">מה קורה השבוע בקיבוץ, בקצרה</p>

      {updates === null ? (
        <Loading />
      ) : updates.length === 0 ? (
        <p className="mt-10 text-center text-lg text-muted-foreground">אין עדכונים עדיין</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {updates.map((u) => (
            <UpdateCard key={u.id} update={u} />
          ))}
        </div>
      )}
    </div>
  );
}
