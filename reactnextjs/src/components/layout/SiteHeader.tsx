"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { debugLog } from "@/src/lib/debug";
import { NavLink, type NavItem } from "./NavLink";
import { UserMenu } from "../auth/UserMenu";

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/film", label: "Film" },
  { href: "/prenotazioni", label: "Prenotazioni" },
  // { href: "/profilo", label: "Profilo" },
];

type SiteHeaderProps = {
  brand?: string;
  items?: NavItem[];
};

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  brand = "CinemaVerse",
  items = DEFAULT_NAV_ITEMS,
}: SiteHeaderProps) {
  const pathname = usePathname();

  useEffect(() => {
    debugLog(3, "SiteHeader", "Route attiva", { pathname });
  }, [pathname]);

  return (
    // <main className="mx-auto flex w-[90%] max-w-[1600px] flex-1 flex-col gap-3 py-10">
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex w-[90%] h-14 items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight text-white"
        >
          {brand}
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-1" aria-label="Navigazione principale">
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isRouteActive(pathname, item.href)}
            />
          ))}

          <UserMenu />
        </nav>
      </div>
    </header>
  );
}
