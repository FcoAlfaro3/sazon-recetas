"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { GrillaRecetas } from "@/components/GrillaRecetas";
import { useFavoritos } from "@/hooks/useFavoritos";

export function ListaFavoritos() {
  const { favoritos, quitar, vaciar } = useFavoritos();
  const [confirmando, setConfirmando] = useState(false);

  // Si el usuario no confirma en 4 segundos, el botón vuelve a su estado normal
  useEffect(() => {
    if (!confirmando) return;
    const temporizador = setTimeout(() => setConfirmando(false), 4000);
    return () => clearTimeout(temporizador);
  }, [confirmando]);

  if (favoritos.length === 0) {
    return (
      <div className="flex max-w-xl flex-col items-start gap-4">
        <div className="grid size-40 place-items-center rounded-full border-2 border-dashed border-borde bg-plato/60">
          <span className="sr-only">Plato vacío</span>
        </div>
        <h2 className="text-2xl font-bold">Aún no guardas recetas</h2>
        <p className="text-piedra">
          Abre cualquier receta y pulsa «Guardar en favoritos» para tenerla a mano aquí.
        </p>
        <Link
          href="/recetas"
          className="rounded-full bg-cilantro px-5 py-2.5 font-semibold text-white hover:bg-cilantro-oscuro"
        >
          Buscar recetas
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-piedra">
          <strong className="text-tinta">{favoritos.length}</strong>{" "}
          {favoritos.length === 1 ? "receta guardada" : "recetas guardadas"}
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirmando) {
              vaciar();
              setConfirmando(false);
            } else {
              setConfirmando(true);
            }
          }}
          className={[
            "rounded-full border px-4 py-2 text-sm font-semibold",
            confirmando ? "border-jamaica bg-jamaica text-white" : "border-borde hover:border-jamaica hover:text-jamaica",
          ].join(" ")}
        >
          {confirmando ? "Pulsa otra vez para vaciar" : "Vaciar favoritos"}
        </button>
      </div>

      <GrillaRecetas
        recetas={favoritos}
        accion={(receta) => (
          <button
            type="button"
            onClick={() => quitar(receta.id)}
            className="text-sm font-semibold text-jamaica underline-offset-4 hover:underline"
          >
            Quitar<span className="sr-only"> {receta.nombre} de favoritos</span>
          </button>
        )}
      />
    </div>
  );
}
