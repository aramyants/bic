"use client";

import * as React from "react";

const STORAGE_KEY = "bic-favorite-vehicles";

type FavoriteState = {
  favorites: Set<string>;
};

const readInitial = (): FavoriteState => {
  if (typeof window === "undefined") {
    return { favorites: new Set() };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { favorites: new Set() };
  }

  try {
    const parsed = JSON.parse(raw) as string[];
    return { favorites: new Set(parsed) };
  } catch (error) {
    console.warn("Failed to parse favorites", error);
    return { favorites: new Set() };
  }
};

export const useFavorites = () => {
  const [favorites, setFavorites] = React.useState<Set<string>>(() => readInitial().favorites);

  const toggleFavorite = React.useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      }
      return next;
    });
  }, []);

  const isFavorite = React.useCallback((id: string) => favorites.has(id), [favorites]);

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
  };
};
