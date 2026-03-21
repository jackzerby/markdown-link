import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashPassword, hashSecret, verifyPassword } from "@/lib/hash";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

function accessCookieName(slug: string) {
  return `mdlink_access_${slug}`;
}

export async function POST(request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "unlock");

  const site = await db.site.findUnique({
    where: { slug },
  });

  if (!site) {
    redirect("/");
  }

  if (intent === "unlock") {
    const password = String(formData.get("password") ?? "");
    if (!site.passwordHash || !verifyPassword(password, site.passwordHash)) {
      redirect(`/p/${slug}?error=wrong-password`);
    }

    const cookieStore = await cookies();
    cookieStore.set(accessCookieName(slug), hashSecret(site.passwordHash, env.SESSION_SECRET), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: `/p/${slug}`,
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect(`/p/${slug}`);
  }

  const user = await requireUser();
  if (site.ownerUserId !== user.id) {
    redirect(`/dashboard/sites/${slug}`);
  }

  if (intent === "clear") {
    await db.site.update({
      where: { id: site.id },
      data: {
        visibility: "PUBLIC",
        passwordHash: null,
      },
    });
    redirect(`/dashboard/sites/${slug}`);
  }

  const password = String(formData.get("password") ?? "");
  if (!password) {
    redirect(`/dashboard/sites/${slug}`);
  }

  await db.site.update({
    where: { id: site.id },
    data: {
      visibility: "PASSWORD",
      passwordHash: hashPassword(password),
    },
  });

  redirect(`/dashboard/sites/${slug}`);
}
