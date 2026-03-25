import { PlanTier } from "@prisma/client";

import { db } from "@/lib/db";
import { env } from "@/lib/env";

export type UsageSnapshot = {
  planTier: PlanTier;
  activeSites: number;
  expiringSites: number;
  totalSites: number;
  monthlyPublishes: number;
  apiKeys: number;
  storageBytes: number;
  siteLimit: number | null;
  storageLimitBytes: number;
};

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = -1;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export async function getUsageSnapshot(userId: string, planTier: PlanTier): Promise<UsageSnapshot> {
  const now = new Date();
  const monthStart = startOfMonth(now);

  const [sites, monthlyPublishes, apiKeys, storageAggregate] = await Promise.all([
    db.site.findMany({
      where: { ownerUserId: userId },
      select: {
        id: true,
        expiresAt: true,
        currentVersionId: true,
      },
    }),
    db.siteVersion.count({
      where: {
        createdByUserId: userId,
        createdAt: {
          gte: monthStart,
        },
      },
    }),
    db.apiKey.count({
      where: {
        userId,
        revokedAt: null,
      },
    }),
    db.siteFile.aggregate({
      _sum: { size: true },
      where: {
        siteVersion: {
          site: {
            ownerUserId: userId,
          },
        },
      },
    }),
  ]);

  const activeSites = sites.filter(
    (site) => site.currentVersionId && (!site.expiresAt || site.expiresAt > now),
  ).length;
  const expiringSites = sites.filter((site) => site.expiresAt && site.expiresAt > now).length;

  return {
    planTier,
    activeSites,
    expiringSites,
    totalSites: sites.length,
    monthlyPublishes,
    apiKeys,
    storageBytes: storageAggregate._sum.size ?? 0,
    siteLimit: planTier === PlanTier.HOBBY ? null : env.FREE_MAX_SITES,
    storageLimitBytes:
      planTier === PlanTier.HOBBY ? env.PAID_STORAGE_BYTES : env.FREE_STORAGE_BYTES,
  };
}

export async function assertPublishWithinPlanLimits(input: {
  userId?: string | null;
  planTier?: PlanTier;
  estimatedBytes: number;
}) {
  if (!input.userId || input.planTier === PlanTier.HOBBY) {
    return null;
  }

  const usage = await getUsageSnapshot(input.userId, input.planTier ?? PlanTier.FREE);
  if (usage.siteLimit !== null && usage.activeSites >= usage.siteLimit) {
    throw new Error(
      `Free plan site limit reached. Upgrade to keep publishing: ${env.APP_URL}/dashboard/plan`,
    );
  }

  if (usage.storageBytes + input.estimatedBytes > usage.storageLimitBytes) {
    throw new Error(
      `Free plan storage limit reached. Upgrade to publish more files: ${env.APP_URL}/dashboard/plan`,
    );
  }

  return usage;
}
