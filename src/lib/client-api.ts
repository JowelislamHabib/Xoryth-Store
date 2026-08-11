import type { ApiResponse } from "./types";

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });
  return res.json() as Promise<ApiResponse<T>>;
}
