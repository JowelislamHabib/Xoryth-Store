"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/products", label: "Products", exact: false },
  { href: "/admin/categories", label: "Categories", exact: false },
  { href: "/admin/orders", label: "Orders", exact: false },
  { href: "/admin/users", label: "Users", exact: false },
  { href: "/admin/reviews", label: "Reviews", exact: false },
];

export function AdminNav({ horizontal }: { horizontal?: boolean }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex gap-1 text-sm",
        horizontal ? "flex-row" : "flex-col",
      )}
    >
      {LINKS.map((link) => {
        const active =
          (link.exact && pathname === link.href) ||
          (!link.exact && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-2 font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
