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
      className="pb-safe fixed inset-x-3 bottom-3 z-40"
    >
      <div
        className="glass-surface mx-auto flex max-w-md items-center rounded-full px-1.5 py-1.5 shadow-[var(--shadow-float-lg)]"
      >
        {ITEMS.map(({ label, path, icon: Icon, exact }) => (
          <NavLink
            key={path}
            to={path}
            end={exact || path === "/"}
            aria-label={label}
            className="flex flex-1 items-center justify-center py-1.5"
          >
            {({ isActive }) => (
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}