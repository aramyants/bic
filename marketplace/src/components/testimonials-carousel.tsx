"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

import type { Testimonial } from "@/db/schema";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const getInitial = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const [first] = Array.from(trimmed);
  return first ? first.toUpperCase() : "?";
};

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const shouldAutoPlay = total > 3;

  useEffect(() => {
    if (!shouldAutoPlay) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [shouldAutoPlay, total]);

  const displayed = useMemo(() => {
    if (!total) return [];
    if (total === 1) return [testimonials[0]];
    if (total === 2) return [testimonials[index % total], testimonials[(index + 1) % total]];
    const prev = testimonials[(index - 1 + total) % total];
    const current = testimonials[index % total];
    const next = testimonials[(index + 1) % total];
    return [prev, current, next];
  }, [index, testimonials, total]);

  const activeCardIndex = displayed.length === 3 ? 1 : 0;

  if (!total) return null;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-black/85 via-black/70 to-brand-secondary/50 p-6 shadow-strong">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_85%_50%,rgba(255,68,68,0.18),transparent_40%)] opacity-70" />
      <div className="relative flex items-center justify-between pb-4">
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.16em] text-white/60">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
            <Quote className="h-4 w-4" />
          </span>
          <span>Живые отзывы клиентов</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Предыдущий"
            onClick={() => setIndex((prev) => (prev - 1 + total) % total)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 transition hover:border-white/35 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Следующий"
            onClick={() => setIndex((prev) => (prev + 1) % total)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/70 transition hover:border-white/35 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-3">
        {displayed.map((testimonial, cardIndex) => {
          const isActive = cardIndex === activeCardIndex;
          return (
            <article
              key={`${testimonial.id}-${cardIndex}`}
              className={`relative rounded-3xl border px-6 py-6 transition duration-500 ${
                isActive
                  ? "border-brand-primary/50 bg-brand-primary/15 shadow-[0_20px_50px_rgba(236,12,12,0.25)]"
                  : "border-white/12 bg-white/5"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <Quote className={`h-5 w-5 ${isActive ? "text-white" : "text-brand-primary"}`} />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="min-h-[120px] text-base leading-relaxed text-white/85">{testimonial.content}</p>
              <div className="mt-6 flex items-center gap-3">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/15"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                    {getInitial(testimonial.name)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  {testimonial.location ? <div className="text-xs text-white/60">{testimonial.location}</div> : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="relative mt-6 flex justify-center gap-2">
        {testimonials.map((_, dotIndex) => (
          <button
            key={dotIndex}
            type="button"
            aria-label={`Показать отзыв ${dotIndex + 1}`}
            onClick={() => setIndex(dotIndex)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              dotIndex === index ? "bg-brand-primary" : "bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
