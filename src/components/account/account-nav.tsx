"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Profile", exact: true },
  { href: "/account/orders", label: "My orders", exact: false },
  { href: "/account/reviews", label: "My reviews", exact: false },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex gap-1 border-b text-sm">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "-mb-px border-b-2 px-3 py-2 font-medium transition-colors",
            (link.exact && pathname === link.href) ||
              (!link.exact && pathname.startsWith(link.href))
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
