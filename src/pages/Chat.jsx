import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function Chat() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <span className="cta-gradient flex h-16 w-16 items-center justify-center rounded-2xl shadow-[var(--shadow-float)]">
        <MessageCircle className="text-white" size={28} aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-bold">דברו איתי</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        עוזר ה-AI של דבירבוט בדרך — בקרוב תוכלו לשאול אותו על העלונים, העדכונים והמידע על הקיבוץ, ישירות מכאן.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-border bg-card px-5 font-medium transition-colors hover:border-primary/40 hover:text-primary"
      >
        <ArrowRight size={18} aria-hidden="true" />
        חזרה לדף הבית
      </Link>
    </div>
  );
}
