import path from "node:path";

export function getUploadsDir() {
  const customDir = process.env.UPLOADS_DIR?.trim();
  return customDir && customDir.length > 0
    ? customDir
    : path.join(process.cwd(), "public", "uploads");
}
