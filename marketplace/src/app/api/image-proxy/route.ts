import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const isPrivateIpv4 = (ip: string) => {
  const [a, b] = ip.split(".").map((part) => Number.parseInt(part, 10));
  if ([a, b].some((value) => Number.isNaN(value))) return true;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
};

const isPrivateIpv6 = (ip: string) => {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("fe80")) return true;
  return false;
};

const isDisallowedHost = (hostname: string) => {
  const normalized = hostname.toLowerCase();
  if (normalized === "localhost") return true;
  if (normalized.endsWith(".local")) return true;
  if (normalized.endsWith(".internal")) return true;
  return false;
};

const resolvePrivateAddress = async (hostname: string) => {
  const ipVersion = isIP(hostname);
  if (ipVersion === 4) return isPrivateIpv4(hostname);
  if (ipVersion === 6) return isPrivateIpv6(hostname);

  try {
    const records = await lookup(hostname, { all: true });
    return records.some((record) => (record.family === 6 ? isPrivateIpv6(record.address) : isPrivateIpv4(record.address)));
  } catch {
    return true;
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "Missing url parameter." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url parameter." }, { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Unsupported protocol." }, { status: 400 });
  }

  if (isDisallowedHost(parsed.hostname) || (await resolvePrivateAddress(parsed.hostname))) {
    return NextResponse.json({ error: "Host is not allowed." }, { status: 403 });
  }

  try {
    const response = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Upstream request failed." }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "URL did not return an image." }, { status: 415 });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("[image-proxy] fetch failed", error);
    return NextResponse.json({ error: "Failed to fetch image." }, { status: 502 });
  }
}
