import Link from "next/link";

export type NavItem = {
  href: string;
  label: string;
};

type NavLinkProps = {
  item: NavItem;
  isActive: boolean;
};

export function NavLink({ item, isActive }: NavLinkProps) {
  return (
    <Link
      href={item.href}
      className={[
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-white/15 text-white"
          : "text-zinc-300 hover:bg-white/10 hover:text-white",
      ].join(" ")}
      aria-current={isActive ? "page" : undefined}
    >
      {item.label}
    </Link>
  );
}
