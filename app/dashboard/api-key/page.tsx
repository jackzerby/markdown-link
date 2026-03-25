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
    <section className="api-key-view">
      <style>{`
        .api-key-view {
          width: min(960px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 28px 0 72px;
        }

        .api-key-view .button {
          border-radius: 6px;
          border: 0;
        }

        .api-key-view .notice {
          border: 0;
          background: var(--surface);
          border-radius: 8px;
          padding: 16px 18px;
        }

        .api-key-view .list {
          gap: 0;
        }

        .api-key-view .list-row {
          border: 0;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          background: transparent;
          padding: 14px 0;
        }

        .api-key-view .list-row:first-child {
          border-top: 0;
        }

        @media (max-width: 820px) {
          .api-key-view {
            width: calc(100vw - 24px);
            padding: 20px 0 56px;
          }
        }
      `}</style>

      <ApiKeyPanel
        existingKeys={apiKeys.map((key) => ({
          id: key.id,
          name: key.name,
          prefix: key.prefix,
          createdAt: key.createdAt.toISOString(),
          lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
        }))}
      />
    </section>
  );
}
