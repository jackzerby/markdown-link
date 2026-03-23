import { NextResponse } from "next/server";
import { DomainStatus } from "@prisma/client";
import { resolveCname, resolveTxt } from "node:dns/promises";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

function extractFormValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim().toLowerCase();
}

function getChallengeHost(hostname: string) {
  return `_markdown-link.${hostname}`;
}

function isLikelyApexDomain(hostname: string) {
  return hostname.split(".").length <= 2;
}

function normalizeDnsName(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

function flattenTxtRecords(records: string[][]) {
  return records.map((parts) => parts.join("")).map(normalizeDnsName);
}

async function verifyDomainDns(domain: {
  hostname: string;
  verificationToken: string;
  dnsTarget: string | null;
}) {
  const challengeHost = getChallengeHost(domain.hostname);
  const expectedToken = normalizeDnsName(domain.verificationToken);
  const expectedTarget = normalizeDnsName(domain.dnsTarget ?? "domains.mdshare.link");

  let txtRecords: string[] = [];
  try {
    txtRecords = flattenTxtRecords(await resolveTxt(challengeHost));
  } catch {
    return {
      ok: false as const,
      error: `TXT record ${challengeHost} was not found.`,
    };
  }

  if (!txtRecords.includes(expectedToken)) {
    return {
      ok: false as const,
      error: `TXT record ${challengeHost} must equal the verification token.`,
    };
  }

  if (!isLikelyApexDomain(domain.hostname)) {
    let cnameRecords: string[] = [];
    try {
      cnameRecords = (await resolveCname(domain.hostname)).map(normalizeDnsName);
    } catch {
      return {
        ok: false as const,
        error: `CNAME record for ${domain.hostname} was not found.`,
      };
    }

    if (!cnameRecords.includes(expectedTarget)) {
      return {
        ok: false as const,
        error: `CNAME record for ${domain.hostname} must point to ${expectedTarget}.`,
      };
    }
  }

  return { ok: true as const };
}

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const hostname = extractFormValue(formData, "hostname");

  if (!hostname) {
    return NextResponse.json({ error: "Hostname is required." }, { status: 400 });
  }

  const domain = await db.domain.findFirst({
    where: {
      hostname,
      userId: user.id,
    },
  });

  if (!domain) {
    return NextResponse.json({ error: "Domain not found." }, { status: 404 });
  }

  const dnsCheck = await verifyDomainDns(domain);
  if (!dnsCheck.ok) {
    const params = new URLSearchParams({
      error: dnsCheck.error,
    });
    return NextResponse.redirect(new URL(`/dashboard/domains?${params.toString()}`, request.url));
  }

  await db.domain.update({
    where: { id: domain.id },
    data: {
      status: DomainStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  });

  const params = new URLSearchParams({
    success: `${domain.hostname} verified.`,
  });
  return NextResponse.redirect(new URL(`/dashboard/domains?${params.toString()}`, request.url));
}
