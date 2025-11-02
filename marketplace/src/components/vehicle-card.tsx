"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import type { VehicleWithRelations } from "@/server/vehicle-service";
import { cn, formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: VehicleWithRelations;
  eurRubRate: number;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, eurRubRate }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(vehicle.id);

  const basePriceRub = formatCurrency(Math.round(vehicle.basePriceEur * eurRubRate), "RUB");

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[36px] border border-white/10 bg-white/8 backdrop-blur-xl shadow-soft transition hover:shadow-strong">
      <div className="relative h-64 overflow-hidden">
        {vehicle.primaryImage ? (
          <Image
            src={vehicle.primaryImage.url}
            alt={vehicle.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-black/40 text-sm text-white/50">
            Photo will be added soon
          </div>
        )}
        <button
          onClick={() => toggleFavorite(vehicle.id)}
          className={cn(
            "absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition",
            isFav && "border-brand-primary bg-brand-primary text-white",
          )}
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
        </button>
        <div className="absolute left-5 top-5 flex gap-2">
          <Badge tone="outline">{vehicle.country}</Badge>
          {vehicle.bodyType ? <Badge tone="default">{vehicle.bodyType}</Badge> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="space-y-2">
          <div className="text-xs text-white/55">{vehicle.brand}</div>
          <h3 className="text-lg font-semibold text-white">{vehicle.title}</h3>
          <p className="text-sm text-white/65">
            {vehicle.shortDescription ?? "Detailed description will appear after the vehicle is processed."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-white/55">
          <div>
            <span className="block text-white/40">Year</span>
            <span className="text-white/85">{vehicle.year}</span>
          </div>
          <div>
            <span className="block text-white/40">Mileage</span>
            <span className="text-white/85">
              {vehicle.mileage?.toLocaleString("ru-RU") ?? "0"} {vehicle.mileageUnit?.toUpperCase() ?? "KM"}
            </span>
          </div>
          <div>
            <span className="block text-white/40">Fuel</span>
            <span className="text-white/85">{vehicle.fuelType ?? "—"}</span>
          </div>
          <div>
            <span className="block text-white/40">Transmission</span>
            <span className="text-white/85">{vehicle.transmission ?? "—"}</span>
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-xs text-white/45">Price</div>
            <div className="text-xl font-semibold text-white">{formatCurrency(vehicle.basePriceEur, "EUR")}</div>
            <div className="text-xs text-white/55">≈ {basePriceRub}</div>
          </div>
          <Link
            href={`/catalog/${vehicle.slug}`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-xs font-semibold text-white transition hover:bg-brand-primary-strong"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};
