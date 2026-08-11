"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api";
import type { LoginResponse, User } from "@/lib/types";
import {
  ACCESS_TOKEN_COOKIE,
  clearSession,
  setSession,
  type SessionUser,
} from "@/lib/session";

export type AuthState = { error?: string; success?: boolean };

async function doLogin(email: string, password: string): Promise<AuthState> {
  const res = await serverFetch<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (res.status >= 400 || !res.data) {
    return { error: res.message || "Login failed" };
  }

  (await cookies()).set(ACCESS_TOKEN_COOKIE, res.data.accessToken, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  await setSession(res.data.user);
  return { success: true };
}

export async function login(_prev: AuthState, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  return doLogin(email, password);
}

export async function signup(_prev: AuthState, formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const res = await serverFetch<User>("/users/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (res.status >= 400) {
    return { error: res.message || "Signup failed" };
  }

  return doLogin(email, password);
}

export async function logout() {
  await clearSession();
  redirect("/");
}

export type { SessionUser };
