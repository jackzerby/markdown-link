import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { env } from "@/lib/env";

const dataRoot = env.STORAGE_LOCAL_ROOT || path.join(process.cwd(), ".data");

function normalizeRelativePath(filePath: string) {
  const normalized = filePath.replaceAll("\\", "/").replace(/^\/+/, "");
  if (!normalized || normalized.includes("..")) {
    throw new Error("Invalid file path.");
  }
  return normalized;
}

function ensureStorageReady() {
  if (env.STORAGE_BACKEND !== "s3") {
    return;
  }

  if (
    !env.STORAGE_S3_BUCKET ||
    !env.STORAGE_S3_ACCESS_KEY_ID ||
    !env.STORAGE_S3_SECRET_ACCESS_KEY
  ) {
    throw new Error("S3 storage is selected but required S3 env vars are missing.");
  }
}

let cachedS3Client: S3Client | null = null;

function getS3Client() {
  ensureStorageReady();
  if (env.STORAGE_BACKEND !== "s3") {
    return null;
  }

  cachedS3Client ??= new S3Client({
    region: env.STORAGE_S3_REGION,
    endpoint: env.STORAGE_S3_ENDPOINT || undefined,
    forcePathStyle: env.STORAGE_S3_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: env.STORAGE_S3_ACCESS_KEY_ID!,
      secretAccessKey: env.STORAGE_S3_SECRET_ACCESS_KEY!,
    },
  });

  return cachedS3Client;
}

function getBucketName() {
  if (!env.STORAGE_S3_BUCKET) {
    throw new Error("Missing STORAGE_S3_BUCKET.");
  }
  return env.STORAGE_S3_BUCKET;
}

function getStoragePrefix() {
  return env.STORAGE_S3_PREFIX.replace(/^\/+|\/+$/g, "");
}

function getObjectKey(slug: string, versionId: string, filePath: string) {
  return `${getStoragePrefix()}/${slug}/${versionId}/${normalizeRelativePath(filePath)}`;
}

function getSlugPrefix(slug: string) {
  return `${getStoragePrefix()}/${slug}/`;
}

export function getVersionStorageDir(slug: string, versionId: string) {
  return path.join(dataRoot, "publishes", slug, versionId);
}

export async function ensureVersionStorageDir(slug: string, versionId: string) {
  const dir = getVersionStorageDir(slug, versionId);
  if (env.STORAGE_BACKEND === "local") {
    await mkdir(dir, { recursive: true });
  }
  return dir;
}

export async function writeVersionFile(input: {
  slug: string;
  versionId: string;
  filePath: string;
  contents: Buffer;
}) {
  const relativePath = normalizeRelativePath(input.filePath);

  if (env.STORAGE_BACKEND === "s3") {
    const client = getS3Client();
    await client!.send(
      new PutObjectCommand({
        Bucket: getBucketName(),
        Key: getObjectKey(input.slug, input.versionId, relativePath),
        Body: input.contents,
      }),
    );
    return getObjectKey(input.slug, input.versionId, relativePath);
  }

  const versionDir = await ensureVersionStorageDir(input.slug, input.versionId);
  const fullPath = path.join(versionDir, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, input.contents);
  return fullPath;
}

export async function readVersionFile(input: {
  slug: string;
  versionId: string;
  filePath: string;
}) {
  const relativePath = normalizeRelativePath(input.filePath);

  if (env.STORAGE_BACKEND === "s3") {
    const client = getS3Client();
    const response = await client!.send(
      new GetObjectCommand({
        Bucket: getBucketName(),
        Key: getObjectKey(input.slug, input.versionId, relativePath),
      }),
    );

    if (!response.Body) {
      throw new Error("Stored file body was empty.");
    }

    const bytes = await response.Body.transformToByteArray();
    return Buffer.from(bytes);
  }

  const fullPath = path.join(getVersionStorageDir(input.slug, input.versionId), relativePath);
  return readFile(fullPath);
}

export async function versionFileExists(input: {
  slug: string;
  versionId: string;
  filePath: string;
}) {
  const relativePath = normalizeRelativePath(input.filePath);

  if (env.STORAGE_BACKEND === "s3") {
    const client = getS3Client();
    try {
      await client!.send(
        new HeadObjectCommand({
          Bucket: getBucketName(),
          Key: getObjectKey(input.slug, input.versionId, relativePath),
        }),
      );
      return true;
    } catch {
      return false;
    }
  }

  try {
    await stat(path.join(getVersionStorageDir(input.slug, input.versionId), relativePath));
    return true;
  } catch {
    return false;
  }
}

export async function getUploadedMarkdown(input: {
  slug: string;
  versionId: string;
  candidatePaths: string[];
}) {
  const preferred = ["index.md", "README.md"];
  const ordered = [...preferred, ...input.candidatePaths].filter(
    (value, index, all) => value.endsWith(".md") && all.indexOf(value) === index,
  );

  for (const candidate of ordered) {
    const exists = await versionFileExists({
      slug: input.slug,
      versionId: input.versionId,
      filePath: candidate,
    });

    if (!exists) {
      continue;
    }

    return {
      path: candidate,
      markdown: (await readVersionFile({
        slug: input.slug,
        versionId: input.versionId,
        filePath: candidate,
      })).toString("utf8"),
    };
  }

  return null;
}

export async function listStoredFiles(input: { slug: string; versionId: string }) {
  if (env.STORAGE_BACKEND === "s3") {
    const client = getS3Client();
    const prefix = `${getStoragePrefix()}/${input.slug}/${input.versionId}/`;
    const results: string[] = [];
    let continuationToken: string | undefined;

    do {
      const page = await client!.send(
        new ListObjectsV2Command({
          Bucket: getBucketName(),
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      for (const object of page.Contents ?? []) {
        if (!object.Key) {
          continue;
        }
        results.push(object.Key.slice(prefix.length));
      }

      continuationToken = page.NextContinuationToken;
    } while (continuationToken);

    return results.sort();
  }

  const baseDir = getVersionStorageDir(input.slug, input.versionId);
  const results: string[] = [];

  async function walk(currentDir: string, prefix = ""): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, relative);
      } else {
        results.push(relative);
      }
    }
  }

  try {
    await stat(baseDir);
    await walk(baseDir);
  } catch {
    return [];
  }

  return results.sort();
}

export async function removePublishStorage(slug: string) {
  if (env.STORAGE_BACKEND === "s3") {
    const client = getS3Client();
    const prefix = getSlugPrefix(slug);
    let continuationToken: string | undefined;

    do {
      const page = await client!.send(
        new ListObjectsV2Command({
          Bucket: getBucketName(),
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );

      const objects = (page.Contents ?? [])
        .map((object) => object.Key)
        .filter((value): value is string => Boolean(value));

      if (objects.length > 0) {
        await client!.send(
          new DeleteObjectsCommand({
            Bucket: getBucketName(),
            Delete: {
              Objects: objects.map((Key) => ({ Key })),
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
    const fs = await import("node:fs/promises");
    await fs.rm(publishDir, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
