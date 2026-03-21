import { ApiKeyPanel } from "@/components/api-key-panel";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DashboardApiKeyPage() {
  const user = await requireUser();
  const apiKeys = await db.apiKey.findMany({
    where: { userId: user.id, revokedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ApiKeyPanel
      existingKeys={apiKeys.map((key) => ({
        id: key.id,
        name: key.name,
        prefix: key.prefix,
        createdAt: key.createdAt.toISOString(),
        lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
      }))}
    />
  );
}
