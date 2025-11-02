"use client";

import * as React from "react";

import type { VehicleWithRelations } from "@/server/vehicle-service";
import { useFavorites } from "@/hooks/use-favorites";
import { VehicleCard } from "@/components/vehicle-card";

interface FavoritesViewProps {
  vehicles: VehicleWithRelations[];
  eurRubRate: number;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ vehicles, eurRubRate }) => {
  const { favorites } = useFavorites();

  const filtered = React.useMemo(() => {
    const set = new Set(favorites);
    return vehicles.filter((vehicle) => set.has(vehicle.id));
  }, [vehicles, favorites]);

  if (filtered.length === 0) {
    return (
      <div className="rounded-[36px] border border-white/10 bg-white/5 p-10 text-center text-sm text-white/60">
        Добавьте автомобили в избранное. Воспользуйтесь карточками в каталоге.
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} eurRubRate={eurRubRate} />
      ))}
    </div>
  );
};

