'use client';

import { useEffect, useRef, useState } from "react";

const VIDEO_SOURCES = ["/bg_1.mp4", "/bg_2.mp4", "/bg_3.mp4", "/bg_4.mp4", "/bg_5.mp4"];

function shuffleSources() {
  const items = [...VIDEO_SOURCES];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function PageVideoBackground() {
  const [enabled, setEnabled] = useState(false);
  const [order, setOrder] = useState<string[]>(VIDEO_SOURCES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"a" | "b">("a");
  const [layerSources, setLayerSources] = useState(() => ({
    a: VIDEO_SOURCES[0],
    b: VIDEO_SOURCES[1 % VIDEO_SOURCES.length] ?? VIDEO_SOURCES[0],
  }));

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const isNarrow = window.matchMedia?.("(max-width: 768px)")?.matches ?? false;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      .connection;
    const saveData = connection?.saveData ?? false;
    const slowConnection = connection?.effectiveType ? ["slow-2g", "2g"].includes(connection.effectiveType) : false;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

    if (reducedMotion || isNarrow || saveData || slowConnection || deviceMemory < 4) {
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const shuffled = shuffleSources();
    setOrder(shuffled);
    setCurrentIndex(0);
    setLayerSources({
      a: shuffled[0],
      b: shuffled[1 % shuffled.length] ?? shuffled[0],
    });
    setActiveLayer("a");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const ref = activeLayer === "a" ? videoARef.current : videoBRef.current;
    if (!ref) return;
    const tryPlay = () => {
      const promise = ref.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => null);
      }
    };

    if (ref.readyState >= 2) {
      tryPlay();
      return;
    }

    ref.addEventListener("canplay", tryPlay, { once: true });
    return () => ref.removeEventListener("canplay", tryPlay);
  }, [activeLayer, layerSources, enabled]);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % order.length;
    const inactiveLayer = activeLayer === "a" ? "b" : "a";
    const nextSource = order[nextIndex] ?? order[0];

    setLayerSources((prev) => ({
      ...prev,
      [inactiveLayer]: nextSource,
    }));
    setCurrentIndex(nextIndex);
    setActiveLayer(inactiveLayer);
  };

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <video
        ref={videoARef}
        key={layerSources.a}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeLayer === "a" ? "opacity-70" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={activeLayer === "a" ? handleNext : undefined}
        onError={activeLayer === "a" ? handleNext : undefined}
        aria-hidden
      >
        <source src={layerSources.a} type="video/mp4" />
      </video>
      <video
        ref={videoBRef}
        key={layerSources.b}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeLayer === "b" ? "opacity-70" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={activeLayer === "b" ? handleNext : undefined}
        onError={activeLayer === "b" ? handleNext : undefined}
        aria-hidden
      >
        <source src={layerSources.b} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/60 to-black/80" />
    </div>
  );
}
