'use client';

import { usePathname } from "next/navigation";

import { PageVideoBackground } from "@/components/page-video-background";

const DISABLED_PREFIXES = ["/catalog", "/legal"];

export function PublicBackground() {
  const pathname = usePathname();
  const shouldDisable = DISABLED_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (shouldDisable) return null;

  return <PageVideoBackground />;
}
