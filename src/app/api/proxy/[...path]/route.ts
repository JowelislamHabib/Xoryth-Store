import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";

async function proxy(
  req: NextRequest,
  ctx: RouteContext<"/api/proxy/[...path]">,
) {
  const { path } = await ctx.params;
  const cookie = req.headers.get("cookie") ?? "";

  const res = await fetch(`${API}/${path.join("/")}`, {
    method: req.method,
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: ["GET", "HEAD"].includes(req.method)
      ? undefined
      : JSON.stringify(await req.json().catch(() => ({}))),
  });

  const data = await res.json();

  const setCookie = res.headers.get("set-cookie");
  const nextRes = NextResponse.json(data);
  if (setCookie) nextRes.headers.set("set-cookie", setCookie);
  return nextRes;
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
