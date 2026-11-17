"use client";

import { useFavoritos } from "@/hooks/useFavoritos";
import type { RecetaResumen } from "@/types/receta";

export function BotonFavorito({ receta }: { receta: RecetaResumen }) {
  const { esFavorito, alternar } = useFavoritos();
  const guardada = esFavorito(receta.id);

  return (
    <button
      type="button"
      onClick={() => alternar(receta)}
      aria-pressed={guardada}
      className={[
        "flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-colors",
        guardada ? "bg-maiz text-tinta hover:bg-[#e8b51c]" : "bg-cilantro text-white hover:bg-cilantro-oscuro",
      ].join(" ")}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 4.5 7 4.5c2.1 0 3.6 1.1 5 3 1.4-1.9 2.9-3 5-3 3.8 0 6 3.8 4.5 7.3C19.5 16.4 12 21 12 21Z"
          fill={guardada ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      {guardada ? "Guardada en favoritos" : "Guardar en favoritos"}
    </button>
  );
}
