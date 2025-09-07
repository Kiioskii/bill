import React from "react";

/**
 * Predefiniowana paleta. Każdy wpis zawiera:
 * - key  -> format który będziemy przechowywać (np. "blue-500")
 * - label -> opis (opcjonalnie)
 * - bg   -> klasa tailwind dla tła (statyczna, by Tailwind jej nie usuwał)
 * - border -> klasa tailwind dla border (statyczna)
 * - hex  -> odpowiadający hex (używany np. do input[type="color"] lub do kontrastu)
 */
export const PALETTE = [
  {
    key: "red-500",
    label: "Red",
    bg: "bg-red-500",
    border: "border-red-500",
    hex: "#EF4444",
  },
  {
    key: "orange-500",
    label: "Orange",
    bg: "bg-orange-500",
    border: "border-orange-500",
    hex: "#F97316",
  },
  {
    key: "yellow-400",
    label: "Yellow",
    bg: "bg-yellow-400",
    border: "border-yellow-400",
    hex: "#FBBF24",
  },
  {
    key: "green-500",
    label: "Green",
    bg: "bg-green-500",
    border: "border-green-500",
    hex: "#22C55E",
  },
  {
    key: "emerald-400",
    label: "Emerald",
    bg: "bg-emerald-400",
    border: "border-emerald-400",
    hex: "#34D399",
  },
  {
    key: "blue-500",
    label: "Blue",
    bg: "bg-blue-500",
    border: "border-blue-500",
    hex: "#3B82F6",
  },
  {
    key: "indigo-500",
    label: "Indigo",
    bg: "bg-indigo-500",
    border: "border-indigo-500",
    hex: "#6366F1",
  },
  {
    key: "purple-500",
    label: "Purple",
    bg: "bg-purple-500",
    border: "border-purple-500",
    hex: "#8B5CF6",
  },
  {
    key: "pink-500",
    label: "Pink",
    bg: "bg-pink-500",
    border: "border-pink-500",
    hex: "#EC4899",
  },
  {
    key: "gray-500",
    label: "Gray",
    bg: "bg-gray-500",
    border: "border-gray-500",
    hex: "#6B7280",
  },
  {
    key: "black",
    label: "Black",
    bg: "bg-black",
    border: "border-black",
    hex: "#000000",
  },
];

/* helper: znajdź wpis w palecie po kluczu */
const findPaletteItem = (key) => PALETTE.find((p) => p.key === key);

/* helper: prosty test kontrastu (czy hex jest "jasny") - do wyboru koloru checkmarka */
const isLightHex = (hex) => {
  if (!hex) return false;
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  // luminance formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 180; // próg — działa wystarczająco dobrze dla checkmarka
};

/**
 * ColorSelector
 * Props:
 *  - value: aktualna wartość (np. "blue-500" lub "#aabbcc")
 *  - onChange: funkcja (value) => void (zwraca key z palety lub hex)
 */
const ColorSelector = ({ value = null, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium block">Wybierz kolor</label>

      <div className="flex flex-wrap gap-2">
        {PALETTE.map((p) => {
          const isSelected = value === p.key;
          const checkColor = isLightHex(p.hex) ? "#000" : "#fff";

          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onChange(p.key)}
              aria-pressed={isSelected}
              className={`relative ${
                p.bg
              } w-8 h-8 rounded-full flex items-center justify-center transition-transform transform
                ${
                  isSelected
                    ? "scale-110 ring-2 ring-offset-2 ring-black"
                    : "hover:scale-105"
                }`}
              title={p.label}
            >
              {isSelected && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke={checkColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorSelector;
