#!/usr/bin/env node

const {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} = require("@aws-sdk/client-s3");
const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();
const fs = require("node:fs/promises");
const path = require("node:path");

const storageBackend = process.env.STORAGE_BACKEND || "local";
const storagePrefix = (process.env.STORAGE_S3_PREFIX || "publishes").replace(/^\/+|\/+$/g, "");
const dataRoot = process.env.STORAGE_LOCAL_ROOT || path.join(process.cwd(), ".data");

let s3Client;

function getS3Client() {
  if (storageBackend !== "s3") {
    return null;
  }

  s3Client ||= new S3Client({
    region: process.env.STORAGE_S3_REGION || "auto",
    endpoint: process.env.STORAGE_S3_ENDPOINT || undefined,
    forcePathStyle: process.env.STORAGE_S3_FORCE_PATH_STYLE === "true",
    credentials: {
      accessKeyId: process.env.STORAGE_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.STORAGE_S3_SECRET_ACCESS_KEY,
    },
  });

  return s3Client;
}

async function removePublishStorage(slug) {
  if (storageBackend === "s3") {
    const client = getS3Client();
    const bucket = process.env.STORAGE_S3_BUCKET;
    const prefix = `${storagePrefix}/${slug}/`;

    if (!bucket) {
      throw new Error("Missing STORAGE_S3_BUCKET.");
    }

    let continuationToken;
    do {
      const page = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      const objects = (page.Contents || [])
        .map((object) => object.Key)
        .filter(Boolean)
        .map((Key) => ({ Key }));

      if (objects.length > 0) {
        await client.send(
          new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: {
              Objects: objects,
              Quiet: true,
            },
          }),
        );
      }

      continuationToken = page.NextContinuationToken;
    } while (continuationToken);

    return true;
  }

  const publishDir = path.join(dataRoot, "publishes", slug);
  try {
    await fs.rm(publishDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error(`warning: failed to remove storage for ${slug}:`, error.message || error);
    return false;
  }
}

async function main() {
  const now = new Date();

  const expired = await db.site.findMany({
    where: {
      ownerUserId: null,
      expiresAt: {
        lt: now,
      },
    },
    select: {
      id: true,
      slug: true,
      expiresAt: true,
    },
  });

  if (expired.length === 0) {
    console.log("no expired anonymous publishes found");
    return;
  }

  let removedStorageCount = 0;

  for (const site of expired) {
    const removed = await removePublishStorage(site.slug);
    if (removed) {
      removedStorageCount += 1;
    }
  }

  const deletion = await db.site.deleteMany({
    where: {
      id: {
        in: expired.map((site) => site.id),
      },
    },
  });

  console.log(
    `removed ${deletion.count} expired anonymous publishes and ${removedStorageCount} storage directories`,
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
