"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { VehicleWithRelations } from "@/server/vehicle-service";
import { cn } from "@/lib/utils";

interface VehicleGalleryProps {
  images: VehicleWithRelations["gallery"];
  title: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const thumbnailsRef = React.useRef<HTMLDivElement | null>(null);
  const total = images.length;

  const clampIndex = React.useCallback(
    (index: number) => {
      if (total === 0) return 0;
      return (index + total) % total;
    },
    [total],
  );

  const showPrev = () => setActiveIndex((prev) => clampIndex(prev - 1));
  const showNext = () => setActiveIndex((prev) => clampIndex(prev + 1));
  const touchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    setActiveIndex((prev) => clampIndex(prev));
  }, [clampIndex]);

  React.useEffect(() => {
    const container = thumbnailsRef.current;
    if (!container) return;
    const activeThumb = container.querySelector<HTMLButtonElement>('[data-active="true"]');
    activeThumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  const activeImage = images[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      <div
        className="group relative overflow-hidden rounded-[42px] border border-white/10 bg-black/40"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPrev();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
          }
        }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchMove={(event) => {
          if (touchStartX.current == null) return;
          const deltaX = event.touches[0]?.clientX - touchStartX.current;
          if (deltaX && Math.abs(deltaX) > 28) {
            if (deltaX > 0) {
              showPrev();
            } else {
              showNext();
            }
            touchStartX.current = null;
          }
        }}
        onTouchEnd={() => {
          touchStartX.current = null;
        }}
        aria-label="Просмотр галереи автомобиля"
      >
        <div className="relative aspect-[16/10] w-full">
          {activeImage ? (
            <Image
              key={activeImage.id ?? activeImage.url}
              src={activeImage.url}
              alt={activeImage.altText ?? title}
              fill
              sizes="(max-width:768px) 100vw, 60vw"
              className="object-cover transition duration-500 ease-out"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/50">Фото пока нет</div>
          )}
        </div>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={showPrev}
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-100 transition hover:bg-black/80 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-100 transition hover:bg-black/80 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/70">
              {activeIndex + 1} / {total}
            </div>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div
          ref={thumbnailsRef}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollSnapType: "x mandatory" }}
          aria-label="Миниатюры фотографий"
        >
          {images.map((image, index) => (
            <button
              key={image.id ?? `${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              data-active={index === activeIndex}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-3xl border border-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
                index === activeIndex && "ring-2 ring-brand-primary",
              )}
              style={{ scrollSnapAlign: "center" }}
              aria-label={`Показать фото ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? title}
                fill
                sizes="120px"
                className="object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {index === activeIndex ? <span className="absolute inset-0 border-2 border-brand-primary" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
