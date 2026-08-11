import { cookies } from "next/headers";
import type { ApiResponse } from "./types";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const cookie = (await cookies()).toString();

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(cookie ? { cookie } : {}),
        ...init?.headers,
      },
      cache: "no-store",
    });
  } catch {
    return {
      status: 500,
      message: `Backend unreachable at ${API}. Is the API server running?`,
      data: null,
    };
  }

  return res.json() as Promise<ApiResponse<T>>;
}
