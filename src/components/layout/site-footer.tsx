import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Xoryth Store. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <Link href="/products" className="transition-colors hover:text-foreground">
            Products
          </Link>
          <Link href="/account/orders" className="transition-colors hover:text-foreground">
            My orders
          </Link>
        </nav>
      </div>
    </footer>
  );
}
