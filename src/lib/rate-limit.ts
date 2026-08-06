import { createHash, timingSafeEqual } from "crypto";
import { headers } from "next/headers";
import { getDb } from "./db";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes after max attempts

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") || h.get("x-vercel-forwarded-for") || "unknown";
}

export async function checkLoginRateLimit(
  ip: string
): Promise<RateLimitResult> {
  const db = await getDb();
  const key = hashIp(ip);
  const now = Date.now();

  const result = await db.execute({
    sql: "SELECT attempts, window_start, locked_until FROM login_attempts WHERE ip_hash = ?",
    args: [key],
  });

  const row = result.rows[0];
  if (!row) {
    return { ok: true, remaining: MAX_ATTEMPTS };
  }

  const lockedUntil = Number(row.locked_until || 0);
  if (lockedUntil > now) {
    return {
      ok: false,
      retryAfterSeconds: Math.ceil((lockedUntil - now) / 1000),
    };
  }

  const windowStart = Number(row.window_start || 0);
  const attempts = Number(row.attempts || 0);

  // Window expired — treat as fresh
  if (now - windowStart > WINDOW_MS) {
    return { ok: true, remaining: MAX_ATTEMPTS };
  }

  if (attempts >= MAX_ATTEMPTS) {
    const until = now + LOCKOUT_MS;
    await db.execute({
      sql: "UPDATE login_attempts SET locked_until = ? WHERE ip_hash = ?",
      args: [until, key],
    });
    return {
      ok: false,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
    };
  }

  return { ok: true, remaining: MAX_ATTEMPTS - attempts };
}

export async function recordFailedLogin(ip: string): Promise<void> {
  const db = await getDb();
  const key = hashIp(ip);
  const now = Date.now();

  const result = await db.execute({
    sql: "SELECT attempts, window_start FROM login_attempts WHERE ip_hash = ?",
    args: [key],
  });

  const row = result.rows[0];
  if (!row || now - Number(row.window_start || 0) > WINDOW_MS) {
    await db.execute({
      sql: `INSERT INTO login_attempts (ip_hash, attempts, window_start, locked_until)
            VALUES (?, 1, ?, 0)
            ON CONFLICT(ip_hash) DO UPDATE SET
              attempts = 1, window_start = excluded.window_start, locked_until = 0`,
      args: [key, now],
    });
    return;
  }

  const attempts = Number(row.attempts || 0) + 1;
  const lockedUntil = attempts >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0;

  await db.execute({
    sql: `UPDATE login_attempts
          SET attempts = ?, locked_until = ?
          WHERE ip_hash = ?`,
    args: [attempts, lockedUntil, key],
  });
}

export async function clearLoginAttempts(ip: string): Promise<void> {
  const db = await getDb();
  const key = hashIp(ip);
  await db.execute({
    sql: "DELETE FROM login_attempts WHERE ip_hash = ?",
    args: [key],
  });
}

/** Constant-time string comparison to avoid timing attacks. */
export function secureCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still do a compare so timing doesn't leak length differences as easily
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/** Small jittered delay so attackers can't measure response timing easily. */
export async function authDelay(ms = 400): Promise<void> {
  const jitter = Math.floor(Math.random() * 200);
  await new Promise((r) => setTimeout(r, ms + jitter));
}
