import type { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/server/firebase-admin";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/config/auth";
import { redirect } from "next/navigation";

export function getAuthToken(req: NextRequest): string | null {
  const header =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token?.trim()) {
    return null;
  }

  return token.trim();
}

const maxDays = Number(process.env.SESSION_COOKIE_MAX_DAYS || "5");
const maxAge = maxDays * 24 * 60 * 60; // seconds
const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

export async function createSessionCookie(idToken: string) {
  return auth().createSessionCookie(idToken, {
    expiresIn: maxAge * 1000, // ms
  });
}

export async function setSessionCookie(idToken: string) {
  const sessionCookie = await auth().createSessionCookie(idToken, {
    expiresIn: maxAge * 1000, // ms
  });
  return sessionCookie;
}

export function writeSessionCookie(resp: NextResponse, sessionCookie: string) {
  resp.cookies.set({
    name: COOKIE_NAME,
    value: sessionCookie,
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    path: "/",
    domain: cookieDomain,
    maxAge,
  });
}

export function clearSessionCookie(resp: NextResponse) {
  resp.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    path: "/",
    domain: cookieDomain,
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getSessionUser(req: NextRequest) {
  const c = req.cookies.get(COOKIE_NAME)?.value;
  if (!c) return null;
  try {
    const decoded = await auth().verifySessionCookie(c, true);
    return decoded;
  } catch {
    return null;
  }
}

export async function requireUser(nextUrl = "/profile") {
  const raw = cookies().get(COOKIE_NAME)?.value;
  if (!raw) {
    redirect(`/`);
  }

  try {
    const decoded = await auth().verifySessionCookie(raw, true);
    return decoded;
  } catch {
    redirect(`/`);
  }
}
