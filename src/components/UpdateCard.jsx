import React from "react";
import ReactMarkdown from "react-markdown";
import { Image } from "@/components/ui/image";
import { formatDateHe } from "@/lib/formatDate";

export default function UpdateCard({ update }) {
  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-heading text-2xl font-semibold">{update.title}</h2>
        <time dateTime={update.post_date} className="text-sm text-muted-foreground">
          {formatDateHe(update.post_date, "d בMMMM")}
        </time>
      </div>
      <p className="mt-1 text-sm font-semibold text-accent">{update.author_name}</p>
      <div className="mt-3 leading-relaxed">
        <ReactMarkdown>{update.body}</ReactMarkdown>
      </div>
      {update.images && update.images.length > 0 && (
        <div className="grain-overlay mt-4 grid gap-3 sm:grid-cols-2">
          {update.images.map((img, i) => (
            <Image key={i} src={img} alt="" className="h-56 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}
    </article>
  );
}