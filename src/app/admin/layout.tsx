import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, hasAccessToken } from "@/lib/session";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  if (!(await hasAccessToken())) redirect("/login?next=/admin");
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8">
      <aside className="hidden w-48 shrink-0 lg:block">
        <div className="sticky top-20 flex flex-col gap-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Admin
          </p>
          <AdminNav />
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            &larr; Back to store
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
