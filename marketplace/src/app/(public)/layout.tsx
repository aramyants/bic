import type { ReactNode } from "react";
import { SiteHeader } from "@/components/shell/site-header";
import { SiteFooter } from "@/components/shell/site-footer";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute -left-[10%] top-[10%] h-[420px] w-[420px] rounded-full bg-brand-primary/20 blur-[120px]" />
        <div className="absolute right-[5%] top-[30%] h-[360px] w-[360px] rounded-full bg-white/6 blur-[120px]" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 pb-24">{children}</main>
        <SiteFooter />
      </div>
      <ScrollToTop />
    </div>
  );
}

