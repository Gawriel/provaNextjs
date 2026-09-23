import Link from "next/link";

export type NavItem = {
  href: string;
  label: string;
};

type NavLinkProps = {
  item: NavItem;
  isActive: boolean;
};

export function NavLink({
  item,
  isActive,
}: NavLinkProps) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`
        group relative px-3 py-2
        text-sm font-medium
        transition-colors duration-200
        ${
          isActive
            ? "text-white"
            : "text-zinc-400 hover:text-white"
        }
      `}
    >
      {item.label}

      <span
        aria-hidden="true"
        className={`
          absolute bottom-0 left-3 right-3 h-px
          origin-center
          bg-amber-400
          transition-transform duration-200 ease-out
          ${
            isActive
              ? "scale-x-100"
              : "scale-x-0 group-hover:scale-x-75"
          }
        `}
      />
    </Link>
  );
}