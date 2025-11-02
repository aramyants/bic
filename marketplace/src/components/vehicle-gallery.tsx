"use client";

import * as React from "react";
import Image from "next/image";

import type { VehicleWithRelations } from "@/server/vehicle-service";

interface VehicleGalleryProps {
  images: VehicleWithRelations["gallery"];
  title: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative h-[420px] overflow-hidden rounded-[42px] border border-white/10 bg-black/40">
        {activeImage ? (
          <Image
            src={activeImage.url}
            alt={activeImage.altText ?? title}
            fill
            sizes="(max-width:768px) 100vw, 60vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/40">
            Галерея будет доступна позже
          </div>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image.id ?? `${image.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="relative h-20 w-28 shrink-0 overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={image.url}
              alt={image.altText ?? title}
              fill
              sizes="120px"
              className="object-cover"
            />
            {index === activeIndex ? (
              <span className="absolute inset-0 border-2 border-brand-primary" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

