import Link from "next/link";
import { getSession } from "@/lib/session";
import { UserMenu } from "@/components/layout/user-menu";
import { CartButton } from "@/components/cart/cart-button";

export async function SiteHeader() {
  const user = await getSession();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          Xoryth
        </Link>
        <nav className="hidden items-center gap-1 text-sm sm:flex">
          <Link
            href="/products"
            className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          {user ? (
            <Link
              href="/account/orders"
              className="rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              My orders
            </Link>
          ) : null}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <CartButton />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
