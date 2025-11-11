import type { Metadata } from "next";
import { Inter, Onest } from "next/font/google";

import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "B.I.C. — Best Imported Cars Marketplace",
  description:
    "B.I.C. is an international marketplace for premium imported cars with end-to-end delivery. We guide clients from sourcing and due diligence through logistics and legalisation in Russia.",
  generator: "Codex Next.js 16",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${onest.variable} ${inter.variable} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
