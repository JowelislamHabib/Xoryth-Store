import { redirect } from "next/navigation";
import { getSession, hasAccessToken } from "@/lib/session";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  if (!(await hasAccessToken())) redirect("/login?next=/account");
  const session = await getSession();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
      <p className="text-sm text-muted-foreground">
        {session ? `Signed in as ${session.email}` : ""}
      </p>
      <AccountNav />
      <div className="mt-6">{children}</div>
    </div>
  );
}
