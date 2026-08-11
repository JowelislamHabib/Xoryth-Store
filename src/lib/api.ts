import { cookies } from "next/headers";
import type { ApiResponse } from "./types";

const API = process.env.API_URL ?? "http://localhost:5000/api/v1";

export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const cookie = (await cookies()).toString();

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  return res.json() as Promise<ApiResponse<T>>;
}
