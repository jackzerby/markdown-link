import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { PlanTier, Prisma } from "@prisma/client";

import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashSecret, randomCode, randomToken } from "@/lib/hash";

const SESSION_COOKIE = "markdown_link_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const LOGIN_CODE_TTL_MS = 1000 * 60 * 15;

export async function requestLoginCode(input: {
  email: string;
  purpose?: "SIGN_IN" | "CLAIM_SITE" | "UPGRADE";
  redirectPath?: string | null;
  siteId?: string | null;
  claimToken?: string | null;
}) {
  const email = input.email.trim().toLowerCase();
  const code = randomCode();
  const codeHash = hashSecret(code, env.SESSION_SECRET);

  await db.emailLoginCode.updateMany({
    where: {
      email,
      purpose: input.purpose ?? "SIGN_IN",
      consumedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });

  await db.emailLoginCode.create({
    data: {
      email,
      codeHash,
      purpose: input.purpose ?? "SIGN_IN",
      redirectPath: input.redirectPath ?? null,
      siteId: input.siteId ?? null,
      claimToken: input.claimToken ?? null,
      expiresAt: new Date(Date.now() + LOGIN_CODE_TTL_MS),
    },
  });

  return code;
}

export async function verifyLoginCode(input: { email: string; code: string }) {
  const email = input.email.trim().toLowerCase();
  const codeHash = hashSecret(input.code.trim(), env.SESSION_SECRET);

  const loginCode = await db.emailLoginCode.findFirst({
    where: {
      email,
      codeHash,
      consumedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!loginCode) {
    return { ok: false as const, message: "Invalid or expired code." };
  }

  const user = await db.$transaction(async (tx) => {
    await tx.emailLoginCode.update({
      where: { id: loginCode.id },
      data: { consumedAt: new Date() },
    });

    const existingUser = await tx.user.upsert({
      where: { email },
      update: { emailVerifiedAt: new Date() },
      create: {
        email,
        emailVerifiedAt: new Date(),
        planTier: PlanTier.FREE,
      },
    });

    if (loginCode.siteId && loginCode.claimToken) {
      const claim = await tx.anonymousClaim.findFirst({
        where: {
          siteId: loginCode.siteId,
          claimedAt: null,
          expiresAt: { gt: new Date() },
          claimTokenHash: hashSecret(loginCode.claimToken, env.SESSION_SECRET),
        },
      });

      if (claim) {
        await tx.anonymousClaim.update({
          where: { id: claim.id },
          data: {
            claimedAt: new Date(),
            claimedByUserId: existingUser.id,
          },
        });

        await tx.site.update({
          where: { id: loginCode.siteId },
          data: {
            ownerUserId: existingUser.id,
            claimedAt: new Date(),
            expiresAt: null,
          },
        });
      }
    }

    return existingUser;
  });

  const sessionToken = randomToken(32);
  const tokenHash = hashSecret(sessionToken, env.SESSION_SECRET);

  const headerStore = await headers();
  const cookieStore = await cookies();

  await db.session.create({
    data: {
      userId: user.id,
      tokenHash,
      userAgent: headerStore.get("user-agent"),
      ipAddress:
        headerStore.get("x-forwarded-for") ??
        headerStore.get("x-real-ip") ??
        undefined,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });

  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + SESSION_TTL_MS),
    path: "/",
  });

  return {
    ok: true as const,
    user,
    redirectPath: loginCode.redirectPath || "/dashboard/sites",
  };
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return null;

  return db.session.findFirst({
    where: {
      tokenHash: hashSecret(sessionToken, env.SESSION_SECRET),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  });
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

async function getUserFromBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authorization.slice("bearer ".length).trim();
  if (!token) {
    return null;
  }

  const prefix = token.slice(0, 12);
  const apiKey = await db.apiKey.findFirst({
    where: {
      prefix,
      revokedAt: null,
    },
    include: {
      user: true,
    },
  });

  if (!apiKey) {
    return null;
  }

  const expectedHash = hashSecret(token, env.API_KEY_PEPPER);
  if (apiKey.secretHash !== expectedHash) {
    return null;
  }

  await db.apiKey.update({
    where: { id: apiKey.id },
    data: {
      lastUsedAt: new Date(),
    },
  });

  return apiKey.user;
}

export async function getRequestUser(request: Request) {
  const bearerUser = await getUserFromBearerToken(request);
  if (bearerUser) {
    return bearerUser;
  }

  return getCurrentUser();
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/start");
  }
  return user;
}

export async function signOut() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionToken) {
    await db.session.updateMany({
      where: {
        tokenHash: hashSecret(sessionToken, env.SESSION_SECRET),
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export const dashboardUserSelect = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    subscription: true,
    apiKeys: {
      where: { revokedAt: null },
      orderBy: { createdAt: "desc" },
    },
    ownedSites: {
      include: {
        currentVersion: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    },
    handles: true,
    domains: true,
    supportRequests: {
      orderBy: { createdAt: "desc" },
      take: 10,
    },
  },
});
