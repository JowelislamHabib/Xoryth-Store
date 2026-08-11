import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/cookie-names";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

async function proxy(
  req: NextRequest,
  ctx: RouteContext<"/api/proxy/[...path]">,
) {
  const { path } = await ctx.params;
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const cookie = token ? `${ACCESS_TOKEN_COOKIE}=${token}` : undefined;

  let res: Response;
  try {
    res = await fetch(`${API}/${path.join("/")}`, {
      method: req.method,
      headers: {
        "content-type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(await req.json().catch(() => ({}))),
    });
  } catch {
    return NextResponse.json({
      status: 500,
      message: `Backend unreachable at ${API}. Is the API server running?`,
      data: null,
    });
  }

  const data = await res.json();

  const setCookie = res.headers.get("set-cookie");
  const nextRes = NextResponse.json(data);
  if (setCookie) nextRes.headers.set("set-cookie", setCookie);
  return nextRes;
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
