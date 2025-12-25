"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Heart } from "lucide-react";
import * as React from "react";

import { getFuelTypeLabel, getTransmissionLabel, UNIT_LABELS } from "@/lib/constants";
import type { VehicleCardModel } from "@/lib/vehicle-card-model";
import { cn, formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

interface VehicleCardProps {
  vehicle: VehicleCardModel;
  eurRubRate: number;
  priceCurrency?: "EUR" | "RUB";
}

const isRemoteUrl = (url: string) => /^https?:\/\//i.test(url.trim());
const isUploadUrl = (url: string) => {
  const trimmed = url.trim();
  return trimmed.startsWith("/uploads/") || trimmed.startsWith("uploads/");
};
const shouldBypassOptimization = (url: string) => isRemoteUrl(url) || isUploadUrl(url);
const getImageSrc = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (isRemoteUrl(trimmed)) {
    return `/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, eurRubRate, priceCurrency = "EUR" }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(vehicle.id);
  const [useNativeImages, setUseNativeImages] = React.useState(false);

  const basePriceRubValue = vehicle.basePriceRub ?? Math.round(vehicle.basePriceEur * eurRubRate);
  const basePriceRub = formatCurrency(basePriceRubValue, "RUB");
  const mileageUnit = UNIT_LABELS[vehicle.mileageUnit as keyof typeof UNIT_LABELS] ?? vehicle.mileageUnit ?? "км";
  const linkHref = `/catalog/${vehicle.slug}`;
  const isExternal = false;
  const title =
    vehicle.title && vehicle.title !== "undefined undefined"
      ? vehicle.title
      : `${vehicle.brand || "Без марки"} ${vehicle.model || ""}`.trim();
  const description = vehicle.shortDescription ?? "Краткое описание отсутствует.";

  const photos = vehicle.gallery?.length
    ? vehicle.gallery
    : vehicle.primaryImage
      ? [vehicle.primaryImage]
      : [{ url: "/logo.png" }];
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const activePhoto = photos[photoIndex];
  const activePhotoBypassOptimization = shouldBypassOptimization(activePhoto.url);
  const activeUsesNativeImage = useNativeImages && activePhotoBypassOptimization;
  const activePhotoSrc = getImageSrc(activePhoto.url);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent ?? "";
    const isTelegram = /Telegram/i.test(ua);
    const isNarrow = window.matchMedia?.("(max-width: 768px)").matches ?? false;
    if (isTelegram || isNarrow) {
      setUseNativeImages(true);
    }
  }, []);

  const next = () => setPhotoIndex((prev) => (prev + 1) % photos.length);
  const prev = () => setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[36px] border border-white/10 bg-white/8 backdrop-blur-xl shadow-soft transition hover:shadow-strong">
      <div className="relative h-64 overflow-hidden">
        {activeUsesNativeImage ? (
          <img
            src={activePhotoSrc}
            alt={vehicle.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Image
            src={activePhotoSrc}
            alt={vehicle.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized={activePhotoBypassOptimization}
            onError={() => setUseNativeImages(true)}
          />
        )}
        {photos.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition hover:bg-black/70"
              onClick={prev}
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 p-2 text-white transition hover:bg-black/70"
              onClick={next}
              aria-label="Следующее фото"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <button
          onClick={() => toggleFavorite(vehicle.id)}
          className={cn(
            "absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition",
            isFav && "border-brand-primary bg-brand-primary text-white",
          )}
          aria-label={isFav ? "Убрать из избранного" : "Добавить в избранное"}
        >
          <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="space-y-2">
          <div className="text-xs text-white/55">{vehicle.brand || "Неизвестный бренд"}</div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/65">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-white/55">
          <div>
            <span className="block text-white/40">Год</span>
            <span className="text-white/85">{vehicle.year || "-"}</span>
          </div>
          <div>
            <span className="block text-white/40">Пробег</span>
            <span className="text-white/85">
              {vehicle.mileage?.toLocaleString("ru-RU") ?? "0"} {mileageUnit}
            </span>
          </div>
          <div>
            <span className="block text-white/40">Топливо</span>
            <span className="text-white/85">{getFuelTypeLabel(vehicle.fuelType)}</span>
          </div>
          <div>
            <span className="block text-white/40">Коробка</span>
            <span className="text-white/85">{getTransmissionLabel(vehicle.transmission)}</span>
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-xs text-white/45">Цена</div>
            <div className="text-xl font-semibold text-white">
              {priceCurrency === "RUB" ? basePriceRub : formatCurrency(vehicle.basePriceEur, "EUR")}
            </div>
            <div className="text-xs text-white/55">
              ≈ {priceCurrency === "RUB" ? formatCurrency(vehicle.basePriceEur, "EUR") : basePriceRub}
            </div>
          </div>
          <Link
            href={linkHref}
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold text-white transition hover:bg-brand-primary-strong"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};
