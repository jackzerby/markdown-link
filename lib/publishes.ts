import { PlanTier, Prisma, SiteVersionStatus } from "@prisma/client";
import { customAlphabet } from "nanoid";

import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashSecret, randomToken } from "@/lib/hash";
import { getUploadedMarkdown, versionFileExists, writeVersionFile } from "@/lib/storage";
import { assertPublishWithinPlanLimits } from "@/lib/usage";

const slugId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);

function generateSlug() {
  return `${slugId()}-${slugId()}-${slugId()}`;
}

export async function createPublish(input: {
  userId?: string | null;
  title?: string | null;
  description?: string | null;
  markdown: string;
  finalize?: boolean;
  planTier?: PlanTier;
}) {
  const estimatedBytes = Buffer.byteLength(input.markdown, "utf8");
  await assertPublishWithinPlanLimits({
    userId: input.userId ?? null,
    planTier: input.planTier,
    estimatedBytes,
  });

  const slug = generateSlug();
  const expiresAt =
    input.userId && input.planTier === PlanTier.HOBBY
      ? null
      : new Date(Date.now() + env.FREE_PUBLISH_TTL_SECONDS * 1000);

  const result = await db.$transaction(async (tx) => {
    const site = await tx.site.create({
      data: {
        ownerUserId: input.userId ?? null,
        slug,
        title: input.title ?? null,
        description: input.description ?? null,
        expiresAt,
      },
    });

    const version = await tx.siteVersion.create({
      data: {
        siteId: site.id,
        versionNumber: 1,
        markdown: input.markdown,
        status: input.finalize ? SiteVersionStatus.LIVE : SiteVersionStatus.PENDING,
        createdByUserId: input.userId ?? null,
      },
    });

    const nextSite = await tx.site.update({
      where: { id: site.id },
      data: {
        currentVersionId: input.finalize ? version.id : null,
      },
    });

    let claimToken: string | null = null;

    if (!input.userId) {
      claimToken = randomToken(24);
      await tx.anonymousClaim.create({
        data: {
          siteId: site.id,
          claimTokenHash: hashSecret(claimToken, env.SESSION_SECRET),
          expiresAt: expiresAt ?? new Date(Date.now() + env.FREE_PUBLISH_TTL_SECONDS * 1000),
        },
      });
    }

    return { site: nextSite, version, claimToken };
  });

  return {
    ...result,
    siteUrl: `/p/${result.site.slug}`,
    claimPath:
      result.claimToken && result.site.expiresAt
        ? `/claim/${result.site.slug}?token=${result.claimToken}`
        : null,
  };
}

type PublishFileManifest = {
  path: string;
  size: number;
  contentType: string;
  sha256?: string | null;
};

export async function createPendingFilePublish(input: {
  userId?: string | null;
  title?: string | null;
  description?: string | null;
  files: PublishFileManifest[];
  planTier?: PlanTier;
}) {
  const estimatedBytes = input.files.reduce((total, file) => total + file.size, 0);
  await assertPublishWithinPlanLimits({
    userId: input.userId ?? null,
    planTier: input.planTier,
    estimatedBytes,
  });

  const slug = generateSlug();
  const expiresAt =
    input.userId && input.planTier === PlanTier.HOBBY
      ? null
      : new Date(Date.now() + env.FREE_PUBLISH_TTL_SECONDS * 1000);

  return db.$transaction(async (tx) => {
    const site = await tx.site.create({
      data: {
        ownerUserId: input.userId ?? null,
        slug,
        title: input.title ?? null,
        description: input.description ?? null,
        expiresAt,
      },
    });

    const uploadToken = randomToken(24);

    const version = await tx.siteVersion.create({
      data: {
        siteId: site.id,
        versionNumber: 1,
        markdown: "",
        status: SiteVersionStatus.PENDING,
        createdByUserId: input.userId ?? null,
        storageKeyPrefix: `${slug}/v1`,
        uploadTokenHash: hashSecret(uploadToken, env.SESSION_SECRET),
        manifestJson: { files: input.files },
      },
    });

    if (input.files.length > 0) {
      await tx.siteFile.createMany({
        data: input.files.map((file) => ({
          siteVersionId: version.id,
          path: file.path,
          size: file.size,
          contentType: file.contentType,
          sha256: file.sha256 ?? null,
          storageKey: `${slug}/${version.id}/${file.path}`,
        })),
      });
    }

    let claimToken: string | null = null;
    if (!input.userId) {
      claimToken = randomToken(24);
      await tx.anonymousClaim.create({
        data: {
          siteId: site.id,
          claimTokenHash: hashSecret(claimToken, env.SESSION_SECRET),
          expiresAt: expiresAt ?? new Date(Date.now() + env.FREE_PUBLISH_TTL_SECONDS * 1000),
        },
      });
    }

    return {
      site,
      version,
      uploadToken,
      claimToken,
    };
  });
}

export async function uploadPendingVersionFile(input: {
  slug: string;
  versionId: string;
  uploadToken: string;
  filePath: string;
  contents: Buffer;
}) {
  const version = await db.siteVersion.findUnique({
    where: { id: input.versionId },
    include: {
      site: true,
      files: true,
    },
  });

  if (!version || version.site.slug !== input.slug) {
    throw new Error("Version not found.");
  }

  if (version.uploadTokenHash !== hashSecret(input.uploadToken, env.SESSION_SECRET)) {
    throw new Error("Invalid upload token.");
  }

  const fileRecord = version.files.find((file) => file.path === input.filePath);
  if (!fileRecord) {
    throw new Error("File not in manifest.");
  }

  await writeVersionFile({
    slug: input.slug,
    versionId: input.versionId,
    filePath: input.filePath,
    contents: input.contents,
  });

  return fileRecord;
}

export async function finalizePublish(
  slug: string,
  userId?: string | null,
  versionId?: string | null,
) {
  const site = await db.site.findUnique({
    where: { slug },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
      },
    },
  });

  if (!site) {
    throw new Error("Publish not found.");
  }

  if (site.ownerUserId && site.ownerUserId !== userId) {
    throw new Error("Not authorized to finalize this publish.");
  }

  const latest = versionId
    ? site.versions.find((version) => version.id === versionId)
    : site.versions[0];
  if (!latest) {
    throw new Error("No pending version found.");
  }

  const versionWithFiles = await db.siteVersion.findUnique({
    where: { id: latest.id },
    include: {
      files: true,
    },
  });

  if (!versionWithFiles) {
    throw new Error("Version not found.");
  }

  for (const file of versionWithFiles.files) {
    const exists = await versionFileExists({
      slug,
      versionId: versionWithFiles.id,
      filePath: file.path,
    });
    if (!exists) {
      throw new Error(`Missing uploaded file: ${file.path}`);
    }
  }

  const uploadedMarkdown = versionWithFiles.files.length
    ? await getUploadedMarkdown({
        slug,
        versionId: versionWithFiles.id,
        candidatePaths: versionWithFiles.files.map((file) => file.path),
      })
    : null;

  const nextMarkdown = uploadedMarkdown?.markdown ?? latest.markdown;
  if (!nextMarkdown) {
    throw new Error("No markdown source found to finalize.");
  }

  return db.$transaction(async (tx) => {
    const version = await tx.siteVersion.update({
      where: { id: latest.id },
      data: {
        markdown: nextMarkdown,
        status: SiteVersionStatus.LIVE,
        finalizedAt: new Date(),
        uploadTokenHash: null,
      },
    });

    const updatedSite = await tx.site.update({
      where: { id: site.id },
      data: {
        currentVersionId: version.id,
      },
    });

    return { site: updatedSite, version };
  });
}

export const siteDetailInclude = Prisma.validator<Prisma.SiteDefaultArgs>()({
  include: {
    currentVersion: true,
    owner: true,
    versions: {
      orderBy: { versionNumber: "desc" },
    },
    claim: true,
  },
});
