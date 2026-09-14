import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Eye, FileText } from "lucide-react";
import { Image } from "@/components/ui/image";
import { formatDateHe } from "@/lib/formatDate";

export default function BulletinCard({ bulletin }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link to={`/bulletins/${bulletin.id}`} className="block" aria-label={`${bulletin.title} — צפייה`}>
        {bulletin.cover_image ? (
          <Image src={bulletin.cover_image} alt="" className="h-44 w-full" />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-primary/10">
            <FileText className="h-12 w-12 text-primary/40" aria-hidden="true" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-heading text-4xl font-semibold leading-none text-primary">
          מס&rsquo; {bulletin.issue_number}
        </p>
        <h3 className="font-heading text-xl font-semibold">{bulletin.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar size={16} aria-hidden="true" />
          <time dateTime={bulletin.publish_date}>{formatDateHe(bulletin.publish_date)}</time>
        </p>
        <Link
          to={`/bulletins/${bulletin.id}`}
          className="mt-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Eye size={18} aria-hidden="true" />
          צפייה מהירה
        </Link>
      </div>
    </article>
  );
}