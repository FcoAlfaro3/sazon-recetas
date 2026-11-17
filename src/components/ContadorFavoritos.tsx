"use client";

import { useFavoritos } from "@/hooks/useFavoritos";

export function ContadorFavoritos({ activo = false }: { activo?: boolean }) {
  const { favoritos } = useFavoritos();
  if (favoritos.length === 0) return null;

  return (
    <span
      className={[
        "grid min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold tabular-nums",
        activo ? "bg-maiz text-tinta" : "bg-cilantro text-white",
      ].join(" ")}
    >
      <span className="sr-only">Recetas guardadas: </span>
      {favoritos.length}
    </span>
  );
}
