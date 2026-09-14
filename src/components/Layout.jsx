import React from "react";
import { Outlet, Link } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { NAV_LINKS } from "@/components/Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-6 md:pb-10">
        <Outlet />
      </main>
      <footer className="border-t border-border/60 bg-card pb-24 pt-8 text-center text-sm text-muted-foreground md:pb-8">
        <p className="font-heading text-lg text-primary">קיבוץ דביר</p>
        <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="קישורי אתר">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-xs">kdvir.org.il · כל הזכויות שמורות</p>
      </footer>
      <BottomNav />
    </div>
  );
}