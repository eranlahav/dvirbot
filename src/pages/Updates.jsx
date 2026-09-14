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
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="font-heading text-4xl font-bold">סובב הולך</h1>
      <p className="mt-2 text-lg text-muted-foreground">חדשות והודעות הקהילה, מהחדש לישן</p>

      {updates === null ? (
        <Loading />
      ) : updates.length === 0 ? (
        <p className="mt-10 text-center text-lg text-muted-foreground">אין עדכונים עדיין</p>
      ) : (
        <div className="mt-6">
          {updates.map((u, i) => (
            <React.Fragment key={u.id}>
              {i > 0 && <hr className="my-8 border-border/70" />}
              <UpdateCard update={u} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}