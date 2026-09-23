"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { debugLog } from "@/src/lib/debug";

import { NavLink, type NavItem } from "./NavLink";
import { UserMenu } from "../auth/UserMenu";

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { href: "/film", label: "Film" },
  { href: "/prenotazioni", label: "Prenotazioni" },
];

type SiteHeaderProps = {
  brand?: string;
  items?: NavItem[];
};

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

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
    <header className="sticky top-0 z-50 bg-[linear-gradient(to_bottom,#000000_0%,#090909_12%,#0f0f0f_25%,#151515_38%,#1b1b1b_50%,#1f1f1f_62%,#232323_75%,#272727_88%,#292929_100%)]
    text-white ">
      <div className="mx-auto flex h-16 w-[90%] max-w-[1600px] items-center justify-between gap-6">
        <Link
          href="/"
          className="group shrink-0"
          aria-label="CinemaVerse - Home"
        >
          <span className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-amber-400">
            Cinema<span className="text-amber-400">Verse</span>
          </span>
        </Link>

        <nav
          className="flex items-center gap-1"
          aria-label="Navigazione principale"
        >
          {items.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              isActive={isRouteActive(pathname, item.href)}
            />
          ))}

          <div className="ml-2 border-l border-white/10 pl-3">
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}