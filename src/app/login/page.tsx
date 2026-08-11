import { redirect } from "next/navigation";
import { hasAccessToken } from "@/lib/session";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  if (await hasAccessToken()) redirect("/");

  const sp = await searchParams;
  const raw = typeof sp.next === "string" ? sp.next : "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <LoginForm next={next} />
    </div>
  );
}
