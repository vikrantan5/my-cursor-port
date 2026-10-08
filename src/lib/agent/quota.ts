import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { AGENT_MESSAGE_LIMIT } from "./copy";

const COOKIE = "agent_quota";
const MAX_AGE = 60 * 60 * 24 * 400;
const ipUsed = new Map<string, number>();

export type Quota = {
  used: number;
  remaining: number;
  exhausted: boolean;
};

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

function secret(): string {
  return (
    process.env.AGENT_QUOTA_SECRET?.trim() ||
    process.env.OPENROUTER_API_KEY?.trim() ||
    "dev-quota-secret"
  );
}

function sign(used: number): string {
  const payload = `${used}.${currentMonth()}`;
  const mac = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${mac}`;
}

function verify(raw: string): number | null {
  const lastDot = raw.lastIndexOf(".");
  if (lastDot <= 0) return null;
  const payload = raw.slice(0, lastDot);
  const mac = raw.slice(lastDot + 1);
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return null;
  if (!timingSafeEqual(left, right)) return null;

  const sep = payload.indexOf(".");
  if (sep <= 0) {
    // Legacy cookie from before the monthly reset (no month in the
    // payload). Signature still checks out, but there's nothing to
    // compare the month against, so treat it as expired rather than
    // as corrupt/invalid.
    const legacyUsed = Number(payload);
    return Number.isInteger(legacyUsed) && legacyUsed >= 0 ? 0 : null;
  }
  const used = Number(payload.slice(0, sep));
  const month = payload.slice(sep + 1);
  if (!Number.isInteger(used) || used < 0) return null;
  if (month !== currentMonth()) return 0; // quota resets each month
  return used;
}

function cookieFromRequest(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${COOKIE}=`)) continue;
    return decodeURIComponent(trimmed.slice(COOKIE.length + 1));
  }
  return undefined;
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return ip;
}

function toQuota(used: number): Quota {
  const safe = Math.min(AGENT_MESSAGE_LIMIT, Math.max(0, used));
  return {
    used: safe,
    remaining: AGENT_MESSAGE_LIMIT - safe,
    exhausted: safe >= AGENT_MESSAGE_LIMIT,
  };
}

function ipKey(request: Request): string {
  return `${clientKey(request)}:${currentMonth()}`;
}

export function readQuota(request: Request): Quota {
  const raw = cookieFromRequest(request);
  const fromCookie = raw ? verify(raw) : 0;
  const cookieUsed = fromCookie === null ? AGENT_MESSAGE_LIMIT : fromCookie;
  const fromIp = ipUsed.get(ipKey(request)) ?? 0;
  return toQuota(Math.max(cookieUsed, fromIp));
}

export function consumeQuota(request: Request): Quota {
  const next = toQuota(readQuota(request).used + 1);
  ipUsed.set(ipKey(request), next.used);
  return next;
}

export function withQuotaCookie(response: NextResponse, quota: Quota): NextResponse {
  response.cookies.set(COOKIE, sign(quota.used), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
