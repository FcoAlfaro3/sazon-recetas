import type { Metadata } from "next";
import { Suspense } from "react";

import { EsqueletoGrilla } from "@/components/Esqueletos";
import { ExploradorRecetas } from "@/components/ExploradorRecetas";
import { obtenerCategorias } from "@/lib/mealdb";
import { etiquetaCategoria } from "@/lib/traducciones";

export const metadata: Metadata = {
  title: "Buscar recetas",
  description: "Busca recetas por nombre o ingrediente y filtra por categoría.",
};

export default function PaginaRecetas() {
  return (
    <>
      <header className="pt-12 pb-8 md:pt-16">
        <h1 className="text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">Recetas</h1>
        <p className="mt-3 max-w-xl text-lg text-piedra">
          Los resultados aparecen mientras escribes. Combina la búsqueda con una categoría para
          afinarla.
        </p>
      </header>

      {/* El explorador lee la URL (useSearchParams), por eso va dentro de Suspense */}
      <Suspense fallback={<EsqueletoGrilla />}>
        <Explorador />
      </Suspense>
    </>
  );
}

// Server Component que obtiene las categorías (cacheadas) y se las pasa
// como props al Client Component interactivo.
async function Explorador() {
  const categorias = await obtenerCategorias();
  const opciones = categorias.map((c) => ({ valor: c.nombre, etiqueta: etiquetaCategoria(c.nombre) }));
  return <ExploradorRecetas categorias={opciones} />;
}
