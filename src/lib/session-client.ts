import { ACCESS_TOKEN_COOKIE, SESSION_COOKIE } from "./cookie-names";
import type { SessionUser } from "./session";

export function getClientSession(): SessionUser | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("=")));
  } catch {
    return null;
  }
}

export function hasClientAccessToken(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${ACCESS_TOKEN_COOKIE}=`));
}
