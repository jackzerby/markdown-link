import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (slug) {
    await db.handle.create({
      data: {
        userId: user.id,
        slug,
        isPrimary: true,
      },
    });
  }

  redirect("/dashboard/handle");
}
