import { mkdir, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE_BYTES } from "@/lib/uploads";
import { getUploadsDir } from "@/lib/uploads-server";
import { getCurrentAdmin } from "@/server/auth";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export async function POST(request: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File payload is required" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json({ error: "File exceeds the maximum allowed size" }, { status: 413 });
  }

  try {
    const uploadsDir = getUploadsDir();
    await mkdir(uploadsDir, { recursive: true });

    const extension = path.extname(file.name) || EXTENSION_BY_MIME[file.type] || ".bin";
    const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    const filePath = path.join(uploadsDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(arrayBuffer));

    return NextResponse.json({ url: `/uploads/${fileName}` });
  } catch (error) {
    console.error("[uploads] failed to persist file", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
