"use client";

import { useId, useState } from "react";

const DEFAULT_COLOR = "#ff4d4f";

function isValidHex(value: string) {
  return /^#([0-9a-fA-F]{6})$/.test(value);
}

export function ColorValuePicker({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const id = useId();
  const initial = defaultValue && isValidHex(defaultValue) ? defaultValue : DEFAULT_COLOR;
  const [color, setColor] = useState(initial);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
          className="h-11 w-11 cursor-pointer rounded-lg border border-white/20 bg-black/40 p-1"
          aria-label="Pick a color"
        />
        <input
          type="text"
          value={color}
          readOnly
          className="h-11 w-full rounded-lg border border-white/15 bg-black/30 px-3 text-sm text-white/70"
        />
        <input type="hidden" name={name} value={color} />
      </div>
      <p className="text-xs text-white/45">Hex-значение будет сохранено в поле «Значение».</p>
    </div>
  );
}
