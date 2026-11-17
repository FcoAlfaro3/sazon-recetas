import Link from "next/link";

import { FormularioBusqueda } from "@/components/FormularioBusqueda";
import { Plato } from "@/components/Plato";
import { RecetaSorpresa } from "@/components/RecetaSorpresa";
import { obtenerCategorias } from "@/lib/mealdb";
import { etiquetaCategoria } from "@/lib/traducciones";

const IDEAS = ["pollo", "pasta", "curry", "tacos", "postre", "sopa"];

// Server Component: el hero y las categorías se prerenderizan; la receta
// sorpresa es un Client Component que llama a nuestro Route Handler.
export default function Inicio() {
  return (
    <>
      <section className="grid grid-cols-1 items-center gap-12 pt-12 pb-16 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:pt-20">
        <div>
          <h1 className="text-[clamp(2.75rem,8.5vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
            ¿Qué cocinamos hoy?
          </h1>
          <p className="mt-6 max-w-xl text-lg text-piedra">
            Recetas de más de 25 países. Busca un plato o un ingrediente, explora por
            categoría y guarda las que quieras cocinar después.
          </p>

          <FormularioBusqueda className="mt-8" />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-piedra">Prueba con</span>
            {IDEAS.map((idea) => (
              <Link
                key={idea}
                href={`/recetas?q=${encodeURIComponent(idea)}`}
                className="rounded-full border border-borde bg-plato px-3.5 py-1 text-sm font-medium hover:border-cilantro hover:text-cilantro"
              >
                {idea}
              </Link>
            ))}
          </div>
        </div>

        <RecetaSorpresa />
      </section>

      <CategoriasDestacadas />
    </>
  );
}

async function CategoriasDestacadas() {
  const categorias = await obtenerCategorias();

  return (
    <section aria-labelledby="titulo-categorias" className="border-t border-borde pt-12">
      <div className="flex items-end justify-between gap-4">
        <h2 id="titulo-categorias" className="text-3xl font-bold sm:text-4xl">
          Explora por categoría
        </h2>
        <Link href="/categorias" className="shrink-0 font-semibold text-cilantro hover:underline">
          Ver todas
        </Link>
      </div>

      <ul className="-mx-5 mt-8 flex snap-x gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
        {categorias.slice(0, 7).map((categoria) => (
          <li key={categoria.id} className="w-28 shrink-0 snap-start sm:w-auto">
            <Link href={`/categorias/${categoria.nombre}`} className="group block text-center">
              <Plato
                src={categoria.imagen}
                alt=""
                sizes="(min-width: 1024px) 140px, 112px"
                className="transition-transform duration-300 group-hover:-rotate-6"
              />
              <span className="mt-3 block font-display text-lg font-semibold group-hover:text-cilantro">
                {etiquetaCategoria(categoria.nombre)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
