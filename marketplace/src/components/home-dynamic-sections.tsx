"use client";

import dynamic from "next/dynamic";

import type { CalculatorSettings } from "@/lib/calculator";
import type { Testimonial } from "@/db/schema";

const LandedCostCalculator = dynamic(
  () => import("@/components/calculator/landed-cost-calculator").then((mod) => mod.LandedCostCalculator),
  {
    ssr: false,
    loading: () => <div className="h-[420px] w-full rounded-[32px] border border-white/10 bg-white/5" />,
  },
);

const TestimonialsCarousel = dynamic(
  () => import("@/components/testimonials-carousel").then((mod) => mod.TestimonialsCarousel),
  {
    ssr: false,
    loading: () => <div className="h-[280px] w-full rounded-[32px] border border-white/10 bg-white/5" />,
  },
);

const ContactForm = dynamic(() => import("@/components/contact-form").then((mod) => mod.ContactForm), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full rounded-[32px] border border-white/10 bg-white/5" />,
});

export function LazyLandedCostCalculator({
  baseRate,
  settings,
}: {
  baseRate: number;
  settings: CalculatorSettings;
}) {
  return <LandedCostCalculator baseRate={baseRate} settings={settings} />;
}

export function LazyTestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  return <TestimonialsCarousel testimonials={testimonials} />;
}

export function LazyContactForm() {
  return <ContactForm />;
}
