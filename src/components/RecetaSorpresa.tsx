"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { etiquetaArea, etiquetaCategoria } from "@/lib/traducciones";
import type { Receta, RespuestaError } from "@/types/receta";

type Estado = "inicial" | "cargando" | "listo" | "error";

/** Client Component: pide una receta al Route Handler /api/recetas/aleatoria. */
export function RecetaSorpresa() {
  const [receta, setReceta] = useState<Receta | null>(null);
  const [estado, setEstado] = useState<Estado>("inicial");
  const [error, setError] = useState("");

  async function sortear() {
    setEstado("cargando");
    setError("");
    try {
      const respuesta = await fetch("/api/recetas/aleatoria", { cache: "no-store" });
      if (!respuesta.ok) {
        const cuerpo = (await respuesta.json().catch(() => null)) as RespuestaError | null;
        throw new Error(cuerpo?.error ?? "No pudimos sortear una receta.");
      }
      setReceta((await respuesta.json()) as Receta);
      setEstado("listo");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos sortear una receta.");
      setEstado("error");
    }
  }

  return (
    <section aria-labelledby="titulo-sorpresa" className="flex flex-col items-center text-center">
      <h2 id="titulo-sorpresa" className="sr-only">
        Receta sorpresa
      </h2>

      <div className="relative w-full max-w-[22rem]">
        {receta ? (
          <Link
            href={`/recetas/${receta.id}`}
            key={receta.id}
            className="block aspect-square motion-safe:animate-servir"
          >
            <div className="relative size-full rounded-full bg-plato p-[5%] ring-1 ring-borde">
              <div className="relative size-full overflow-hidden rounded-full">
                <Image
                  src={receta.imagen}
                  alt={receta.nombre}
                  fill
                  sizes="352px"
                  className="object-cover"
                />
              </div>
            </div>
          </Link>
        ) : (
          <div className="grid aspect-square place-items-center rounded-full border-2 border-dashed border-borde bg-plato/60 p-10">
            <p className="max-w-[14rem] text-piedra">
              ¿Sin ideas? Deja que el plato decida por ti.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 min-h-[4.5rem]" aria-live="polite">
        {estado === "listo" && receta && (
          <>
            <Link
              href={`/recetas/${receta.id}`}
              className="font-display text-2xl font-semibold leading-tight hover:text-cilantro"
            >
              {receta.nombre}
            </Link>
            <p className="mt-1 text-sm text-piedra">
              {etiquetaCategoria(receta.categoria)} de {etiquetaArea(receta.area)}
            </p>
          </>
        )}
        {estado === "error" && <p className="text-jamaica">{error}</p>}
        {estado === "cargando" && <p className="text-piedra">Buscando en la cocina…</p>}
      </div>

      <button
        type="button"
        onClick={sortear}
        disabled={estado === "cargando"}
        className="mt-2 rounded-full bg-maiz px-6 py-3 font-semibold text-tinta transition-colors hover:bg-[#e8b51c] disabled:opacity-60"
      >
        {receta ? "Sortear otra receta" : "Sortear una receta"}
      </button>
    </section>
  );
}
