import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN_COOKIE, SESSION_COOKIE } from "./cookie-names";
import type { LoginResponse } from "./types";

export { ACCESS_TOKEN_COOKIE, SESSION_COOKIE };

export type SessionUser = LoginResponse["user"];

export async function getSession(): Promise<SessionUser | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function hasAccessToken(): Promise<boolean> {
  return (await cookies()).has(ACCESS_TOKEN_COOKIE);
}

export async function setSession(user: SessionUser) {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: false,
    sameSite: "strict",
    path: "/",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(ACCESS_TOKEN_COOKIE);
}

export async function requireUser(
  redirectTo = "/login",
): Promise<SessionUser> {
  if (!(await hasAccessToken())) {
    redirect(redirectTo);
  }
  return (await getSession())!;
}
