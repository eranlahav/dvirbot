import React from "react";

export default function Loading({ label = "טוען..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}