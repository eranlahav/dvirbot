import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Newspaper, Megaphone, Images, Info } from "lucide-react";

const ITEMS = [
  { label: "ראשי", path: "/", icon: Home, exact: true },
  { label: "עלונים", path: "/bulletins", icon: Newspaper },
  { label: "עדכונים", path: "/updates", icon: Megaphone },
  { label: "גלריה", path: "/gallery", icon: Images },
  { label: "אודות", path: "/pages/about", icon: Info },
];

export default function BottomNav() {
  return (
    <nav
      aria-label="ניווט ראשי"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-md md:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {ITEMS.map(({ label, path, icon: Icon, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact || path === "/"}
            className={({ isActive }) =>
              `flex min-h-[56px] min-w-[60px] flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors ${
                isActive ? "text-accent" : "text-foreground/60"
              }`
            }
          >
            <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}