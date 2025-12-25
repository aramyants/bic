"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SOURCES = ["/bg_1.mp4", "/bg_2.mp4", "/bg_3.mp4", "/bg_4.mp4", "/bg_5.mp4"];

export function HeroBackground() {
  const [sourceOrder, setSourceOrder] = useState<string[]>(VIDEO_SOURCES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"a" | "b">("a");
  const [layerSources, setLayerSources] = useState(() => ({
    a: VIDEO_SOURCES[0],
    b: VIDEO_SOURCES[1 % VIDEO_SOURCES.length] ?? VIDEO_SOURCES[0],
  }));

  const videoARef = useRef<HTMLVideoElement | null>(null);
  const videoBRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Shuffle client-side only to avoid SSR/CSR mismatch.
    const items = [...VIDEO_SOURCES];
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    setSourceOrder(items);
    setCurrentIndex(0);
    setLayerSources({
      a: items[0],
      b: items[1 % items.length] ?? items[0],
    });
    setActiveLayer("a");
  }, []);

  useEffect(() => {
    const ref = activeLayer === "a" ? videoARef.current : videoBRef.current;
    if (!ref) return;
    const play = () => {
      const promise = ref.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => null);
      }
    };
    if (ref.readyState >= 2) {
      play();
      return;
    }
    ref.addEventListener("canplay", play, { once: true });
    return () => ref.removeEventListener("canplay", play);
  }, [activeLayer, layerSources]);

  const handleEnded = () => {
    const nextIndex = (currentIndex + 1) % sourceOrder.length;
    const inactiveLayer = activeLayer === "a" ? "b" : "a";
    const nextSource = sourceOrder[nextIndex] ?? sourceOrder[0];

    setLayerSources((prev) => ({
      ...prev,
      [inactiveLayer]: nextSource,
    }));
    setCurrentIndex(nextIndex);
    setActiveLayer(inactiveLayer);
  };

  return (
    <div className="absolute inset-0 -z-10">
      <video
        ref={videoARef}
        key={layerSources.a}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeLayer === "a" ? "opacity-70" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={activeLayer === "a" ? handleEnded : undefined}
        onError={activeLayer === "a" ? handleEnded : undefined}
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
        preload="auto"
        onEnded={activeLayer === "b" ? handleEnded : undefined}
        onError={activeLayer === "b" ? handleEnded : undefined}
      >
        <source src={layerSources.b} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/85" />
    </div>
  );
}
