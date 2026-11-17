import type { Metadata } from "next";
import Link from "next/link";

import { Plato } from "@/components/Plato";
import { obtenerCategorias } from "@/lib/mealdb";
import { etiquetaCategoria } from "@/lib/traducciones";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora las recetas por tipo de plato: pollo, pasta, mariscos, postres y más.",
};

// Server Component: los datos vienen de una función cacheada ("use cache"),
// así que la página completa se prerenderiza y se revalida cada día.
export default async function PaginaCategorias() {
  const categorias = await obtenerCategorias();

  return (
    <>
      <header className="pt-12 pb-10 md:pt-16">
        <h1 className="text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">Categorías</h1>
        <p className="mt-3 max-w-xl text-lg text-piedra">
          {categorias.length} tipos de plato para empezar a explorar.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {categorias.map((categoria, i) => (
          <li key={categoria.id}>
            <Link href={`/categorias/${categoria.nombre}`} className="group block">
              <Plato
                src={categoria.imagen}
                alt=""
                sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 45vw"
                priority={i < 5}
                className="transition-transform duration-300 group-hover:-rotate-6"
              />
              <h2 className="mt-4 text-2xl font-bold group-hover:text-cilantro">
                {etiquetaCategoria(categoria.nombre)}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
