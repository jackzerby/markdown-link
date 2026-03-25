import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!subject || !message) {
    redirect("/dashboard/support?error=Subject%20and%20message%20are%20required.");
  }

  await db.supportRequest.create({
    data: {
      userId: user.id,
      subject,
      message,
    },
  });

  redirect("/dashboard/support?success=Message%20sent.");
}
