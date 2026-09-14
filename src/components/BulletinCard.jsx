import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Newspaper } from "lucide-react";
import { formatDateHe } from "@/lib/formatDate";

export default function BulletinCard({ bulletin, emphasize = false }) {
  return (
    <Link
      to={`/bulletins/${bulletin.id}`}
      className="flex items-center gap-3.5 rounded-3xl bg-card p-3.5 shadow-sm ring-1 ring-border/50 transition-shadow hover:shadow-md"
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          emphasize ? "bg-gradient-to-br from-primary/80 to-primary" : "bg-secondary"
        }`}
      >
        <Newspaper className={emphasize ? "text-white" : "text-muted-foreground"} size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-base font-bold text-foreground">
          {bulletin.title}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {formatDateHe(bulletin.publish_date)}
        </span>
      </span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          emphasize ? "bg-primary/10" : "bg-secondary"
        }`}
      >
        <ArrowLeft className={emphasize ? "text-primary" : "text-muted-foreground"} size={15} aria-hidden="true" />
      </span>
    </Link>
  );
}
