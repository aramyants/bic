import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getUploadsDir } from "@/lib/uploads-server";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: { path?: string[] } }
) {
  const parts = params.path ?? [];
  if (!parts.length) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const uploadsDir = getUploadsDir();
  const resolvedBase = path.resolve(uploadsDir);
  const resolvedPath = path.resolve(uploadsDir, ...parts);

  if (!resolvedPath.startsWith(resolvedBase)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const file = await readFile(resolvedPath);
    const extension = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_BY_EXTENSION[extension] ?? "application/octet-stream";
    return new NextResponse(file, {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
}
