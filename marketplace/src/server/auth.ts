import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/client"
import { users, adminSessions } from "@/db/schema"
import { generateSessionToken, hashPassword, hashSessionToken, verifyPassword, getExpiryDate, isExpired } from "@/lib/security"

const SESSION_COOKIE = "bic_admin_session"
const SESSION_TTL_DAYS = 7

export async function signIn(email: string, password: string) {
  const user = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) })
  if (!user) {
    return null
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return null
  }

  const token = generateSessionToken()
  const hashed = hashSessionToken(token)
  const expiresAt = getExpiryDate(SESSION_TTL_DAYS).toISOString()

  const headerSource = headers()
  const resolvedHeaders =
    typeof (headerSource as unknown as { then?: unknown })?.then === "function" ? await headerSource : headerSource

  const getHeaderValue = (key: string) => {
    if (!resolvedHeaders) {
      return undefined
    }

    const normalizedKey = key.toLowerCase()
    const candidate = resolvedHeaders as Headers
    if (typeof candidate?.get === "function") {
      const value = candidate.get(normalizedKey)
      if (value) {
        return value
      }
    }

    const iterable = resolvedHeaders as { entries?: () => Iterable<[string, string]> }
    if (typeof iterable?.entries === "function") {
      for (const [entryKey, entryValue] of iterable.entries()) {
        if (entryKey?.toLowerCase() === normalizedKey) {
          return entryValue
        }
      }
    }

    if (typeof resolvedHeaders === "object" && resolvedHeaders !== null) {
      for (const [entryKey, entryValue] of Object.entries(
        resolvedHeaders as Record<string, string | string[] | undefined>
      )) {
        if (entryKey?.toLowerCase() !== normalizedKey) {
          continue
        }
        if (Array.isArray(entryValue)) {
          return entryValue[0]
        }
        if (typeof entryValue === "string") {
          return entryValue
        }
      }
    }

    return undefined
  }

  const userAgent = getHeaderValue("user-agent") ?? "unknown"
  const ipAddress = getHeaderValue("x-forwarded-for") ?? getHeaderValue("cf-connecting-ip") ?? "unknown"

  await db.insert(adminSessions).values({
    userId: user.id,
    tokenHash: hashed,
    expiresAt,
    userAgent,
    ipAddress,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(expiresAt),
  })

  return { id: user.id, email: user.email, name: user.name }
}

export async function signOut() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE)
  if (!cookie) {
    return
  }

  const hashed = hashSessionToken(cookie.value)
  await db.delete(adminSessions).where(eq(adminSessions.tokenHash, hashed))
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE)
  if (!sessionCookie) {
    return null
  }

  const hashed = hashSessionToken(sessionCookie.value)
  const session = await db.query.adminSessions.findFirst({
    where: eq(adminSessions.tokenHash, hashed),
    with: {
      user: true,
    },
  })

  if (!session || isExpired(session.expiresAt)) {
    cookieStore.delete(SESSION_COOKIE)
    return null
  }

  return session.user
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    redirect("/admin/login")
  }
  return admin
}

export async function createAdminAccount(email: string, password: string, name?: string) {
  const existing = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) })
  if (existing) {
    return existing
  }

  const passwordHash = await hashPassword(password)
  const [created] = await db
    .insert(users)
    .values({ email: email.toLowerCase(), passwordHash, name })
    .returning()

  return created
}
