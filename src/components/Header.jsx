import React from "react";
import { Link, NavLink } from "react-router-dom";

export const NAV_LINKS = [
  { label: "ראשי", path: "/" },
  { label: "עלונים", path: "/bulletins" },
  { label: "עדכונים", path: "/updates" },
  { label: "גלריה", path: "/gallery" },
  { label: "אודות הקיבוץ", path: "/pages/about" },
];

export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="18" className="fill-primary" />
      <g stroke="hsl(0 0% 100%)" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M32 52 V20" />
        <path d="M32 28 C 24 26 20 20 20 12 C 28 14 32 20 32 26" />
        <path d="M32 28 C 40 26 44 20 44 12 C 36 14 32 20 32 26" />
        <path d="M32 40 C 24 38 20 32 20 24 C 28 26 32 32 32 38" opacity=".65" />
        <path d="M32 40 C 40 38 44 32 44 24 C 36 26 32 32 32 38" opacity=".65" />
      </g>
    </svg>
  );
}

export default function Header() {
  return (
    <header className="pt-safe sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="דבירבוט — דף הבית">
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-2xl font-bold text-primary">דבירבוט</span>
            <span className="mt-0.5 text-xs text-muted-foreground">כל מה שקורה בדביר</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="ניווט ראשי">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2.5 text-base font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/75 hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
