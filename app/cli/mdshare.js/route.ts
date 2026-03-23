import { readFileSync } from "node:fs";
import { join } from "node:path";

export async function GET() {
  const cliPath = join(process.cwd(), "cli", "markdown.link.js");
  const source = readFileSync(cliPath, "utf-8");

  return new Response(source, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Content-Disposition": 'attachment; filename="mdshare.js"',
      "Cache-Control": "public, max-age=300",
    },
  });
}
