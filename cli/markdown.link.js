#!/usr/bin/env node

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");

function usage() {
  const text = `markdown.link

Usage:
  markdown.link [file|-] [options]

Options:
  --title <text>        Viewer title
  --description <text>  Viewer description
  --base-url <url>      API base URL (default: http://localhost:3000)
  --api-key <key>       API key for authenticated publishing
  --help                Show this help

Auth sources:
  --api-key
  MARKDOWN_LINK_API_KEY
  ~/.markdown-link/credentials

Publish modes:
  file path     manifest create -> upload -> finalize
  stdin         direct markdown POST

Examples:
  markdown.link README.md
  cat plan.md | markdown.link -
  markdown.link note.md --title "Weekly Plan" --description "Draft"
`;
  process.stdout.write(text);
}

function die(message) {
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const flags = {
    title: "",
    description: "",
    baseUrl: process.env.MARKDOWN_LINK_BASE_URL || "http://localhost:3000",
    apiKey: process.env.MARKDOWN_LINK_API_KEY || "",
    input: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
      continue;
    }
    if (arg === "--title") {
      flags.title = argv[++i] ?? "";
      continue;
    }
    if (arg === "--description") {
      flags.description = argv[++i] ?? "";
      continue;
    }
    if (arg === "--base-url") {
      flags.baseUrl = argv[++i] ?? "";
      continue;
    }
    if (arg === "--api-key") {
      flags.apiKey = argv[++i] ?? "";
      continue;
    }
    if (arg.startsWith("--")) {
      die(`unknown option: ${arg}`);
    }
    if (flags.input) {
      die(`unexpected argument: ${arg}`);
    }
    flags.input = arg;
  }

  return flags;
}

async function readCredentialsFile() {
  const credentialsPath = path.join(os.homedir(), ".markdown-link", "credentials");
  try {
    return (await fsp.readFile(credentialsPath, "utf8")).trim();
  } catch {
    return "";
  }
}

async function resolveApiKey(flags) {
  if (flags.apiKey) {
    return flags.apiKey.trim();
  }

  const fileKey = await readCredentialsFile();
  return fileKey || "";
}

async function readMarkdownFromStdin() {
  return await new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
    if (process.stdin.isTTY) {
      reject(
        new Error("no input file provided and stdin is empty; pass a markdown file or pipe content in"),
      );
    }
  });
}

async function readTextInput(input) {
  if (!input || input === "-") {
    return {
      kind: "stdin",
      markdown: await readMarkdownFromStdin(),
    };
  }

  const filePath = path.resolve(process.cwd(), input);
  const stat = await fsp.stat(filePath);

  if (stat.isDirectory()) {
    return { kind: "directory", filePath };
  }

  return {
    kind: "file",
    filePath,
    contents: await fsp.readFile(filePath),
  };
}

function guessContentType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".md":
    case ".markdown":
    case ".mdown":
    case ".mkd":
      return "text/markdown; charset=utf-8";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".yml":
    case ".yaml":
      return "text/yaml; charset=utf-8";
    case ".csv":
      return "text/csv; charset=utf-8";
    case ".html":
    case ".htm":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
    case ".mjs":
      return "text/javascript; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function sanitizeRemotePath(filePath) {
  return filePath.replaceAll(path.sep, "/").replace(/^\/+/, "");
}

async function collectDirectoryFiles(rootDir) {
  const entries = [];

  async function walk(currentDir, relativeDir = "") {
    const dirEntries = await fsp.readdir(currentDir, { withFileTypes: true });
    for (const entry of dirEntries) {
      if (entry.name === ".DS_Store") {
        continue;
      }

      const absolutePath = path.join(currentDir, entry.name);
      const relativePath = relativeDir ? path.join(relativeDir, entry.name) : entry.name;
      if (entry.isDirectory()) {
        await walk(absolutePath, relativePath);
        continue;
      }

      const contents = await fsp.readFile(absolutePath);
      entries.push({
        localPath: absolutePath,
        remotePath: sanitizeRemotePath(relativePath),
        contentType: guessContentType(absolutePath),
        size: contents.byteLength,
        sha256: sha256(contents),
        contents,
      });
    }
  }

  await walk(rootDir);
  return entries.sort((a, b) => a.remotePath.localeCompare(b.remotePath));
}

function pickMarkdownEntry(entries) {
  const preferred = entries.find((entry) => entry.remotePath === "README.md") ||
    entries.find((entry) => entry.remotePath === "index.md") ||
    entries.find((entry) => /\.md$/i.test(entry.remotePath)) ||
    entries[0];

  if (!preferred) {
    return null;
  }

  return {
    ...preferred,
    remotePath: "README.md",
    contentType: "text/markdown; charset=utf-8",
  };
}

async function createManifestPublish({ baseUrl, apiKey, title, description, entries }) {
  const response = await fetch(`${baseUrl}/api/publishes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      title: title || undefined,
      description: description || undefined,
      files: entries.map((entry) => ({
        path: entry.remotePath,
        size: entry.size,
        contentType: entry.contentType,
        sha256: entry.sha256,
      })),
    }),
  });

  const payload = await response.json().catch(async () => ({ error: await response.text() }));
  if (!response.ok) {
    die(payload.error || `publish failed with HTTP ${response.status}`);
  }

  return payload;
}

async function uploadManifestFiles({ uploads, apiKey, entries }) {
  const byPath = new Map(entries.map((entry) => [entry.remotePath, entry]));

  for (const upload of uploads) {
    const entry = byPath.get(upload.path);
    if (!entry) {
      die(`missing local file for upload path ${upload.path}`);
    }

    const response = await fetch(upload.url, {
      method: upload.method || "PUT",
      headers: {
        ...(upload.headers || {}),
        ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
      },
      body: entry.contents,
    });

    if (!response.ok) {
      die(`upload failed for ${upload.path} with HTTP ${response.status}`);
    }
  }
}

async function finalizeManifestPublish({ baseUrl, apiKey, slug, versionId }) {
  const response = await fetch(`${baseUrl}/api/publishes/${slug}/finalize`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({ versionId }),
  });

  const payload = await response.json().catch(async () => ({ error: await response.text() }));
  if (!response.ok) {
    die(payload.error || `finalize failed with HTTP ${response.status}`);
  }

  return payload;
}

async function publishMarkdownBody({ baseUrl, apiKey, title, description, markdown }) {
  const response = await fetch(`${baseUrl}/api/publishes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      markdown,
      title: title || undefined,
      description: description || undefined,
      finalize: true,
    }),
  });

  const payload = await response.json().catch(async () => ({ error: await response.text() }));
  if (!response.ok) {
    die(payload.error || `publish failed with HTTP ${response.status}`);
  }

  return payload;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const baseUrl = String(args.baseUrl || "").replace(/\/+$/, "");
  if (!baseUrl) {
    die("base URL is required");
  }

  const apiKey = await resolveApiKey(args);
  const input = await readTextInput(args.input);

  if (input.kind === "stdin") {
    const markdown = input.markdown.trim();
    if (!markdown) {
      die("markdown content is empty");
    }

    const payload = await publishMarkdownBody({
      baseUrl,
      apiKey,
      title: args.title,
      description: args.description,
      markdown,
    });

    if (!payload.siteUrl) {
      die("publish succeeded but no siteUrl was returned");
    }

    process.stdout.write(`${payload.siteUrl}\n`);
    if (payload.claimUrl) {
      process.stderr.write(`claim: ${payload.claimUrl}\n`);
    }
    return;
  }

  let manifestEntries;

  if (input.kind === "file") {
    const basename = path.basename(input.filePath);
    manifestEntries = [
      {
        localPath: input.filePath,
        remotePath: "README.md",
        contentType: "text/markdown; charset=utf-8",
        size: input.contents.byteLength,
        sha256: sha256(input.contents),
        contents: input.contents,
        sourceName: basename,
      },
    ];
  } else {
    const entries = await collectDirectoryFiles(input.filePath);
    if (entries.length === 0) {
      die("directory is empty");
    }

    const markdownEntry = pickMarkdownEntry(entries);
    if (!markdownEntry) {
      die("no markdown file found to publish");
    }

    manifestEntries = [
      markdownEntry,
      ...entries.filter((entry) => entry.remotePath !== markdownEntry.remotePath),
    ];
  }

  const created = await createManifestPublish({
    baseUrl,
    apiKey,
    title: args.title,
    description: args.description,
    entries: manifestEntries,
  });

  if (!created.upload || !Array.isArray(created.upload.uploads)) {
    die("publish succeeded but no upload instructions were returned");
  }

  await uploadManifestFiles({
    uploads: created.upload.uploads,
    apiKey,
    entries: manifestEntries,
  });

  const finalized = await finalizeManifestPublish({
    baseUrl,
    apiKey,
    slug: created.slug,
    versionId: created.upload.versionId,
  });

  const siteUrl = finalized.siteUrl || created.siteUrl;
  if (!siteUrl) {
    die("finalize succeeded but no siteUrl was returned");
  }

  process.stdout.write(`${siteUrl}\n`);
  if (created.claimUrl) {
    process.stderr.write(`claim: ${created.claimUrl}\n`);
  }
}

main().catch((error) => {
  die(error instanceof Error ? error.message : "unexpected CLI failure");
});
