import React from "react";
import ReactMarkdown from "react-markdown";
import { Image } from "@/components/ui/image";
import { formatDateHe } from "@/lib/formatDate";

export default function UpdateCard({ update }) {
  const [firstImage, ...restImages] = update.images || [];

  return (
    <article className="overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/50">
      {firstImage && (
        <div className="relative h-48">
          <Image src={firstImage} alt="" fittingType="fill" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/5 to-transparent" />
          <p className="absolute inset-x-4 bottom-3 text-xs text-white/85">
            {formatDateHe(update.post_date)}
          </p>
        </div>
      )}
      <div className="p-5">
        {!firstImage && (
          <time dateTime={update.post_date} className="text-xs text-muted-foreground">
            {formatDateHe(update.post_date)}
          </time>
        )}
        <h2 className="mt-1 font-heading text-xl font-bold">{update.title}</h2>
        {update.author_name && (
          <p className="mt-1 text-sm font-semibold text-primary">{update.author_name}</p>
        )}
        <div className="reading-prose mt-3 max-w-none leading-relaxed">
          <ReactMarkdown>{update.body}</ReactMarkdown>
        </div>
        {restImages.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {restImages.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt=""
                fittingType="fill"
                className="h-44 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
