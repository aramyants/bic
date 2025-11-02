"use client";

import * as React from "react";
import { Heart } from "lucide-react";

import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export const FavoriteToggle: React.FC<{ vehicleId: string }> = ({ vehicleId }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(vehicleId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(vehicleId)}
      className={cn(
        "flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/60 transition",
        fav && "border-brand-primary bg-brand-primary/20 text-white",
      )}
    >
      <Heart className={cn("h-4 w-4", fav && "fill-current text-brand-primary")} />
      {fav ? "В избранном" : "В избранное"}
    </button>
  );
};

