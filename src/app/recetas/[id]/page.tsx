import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { BotonFavorito } from "@/components/BotonFavorito";
import { EsqueletoDetalle } from "@/components/Esqueletos";
import { ListaIngredientes } from "@/components/ListaIngredientes";
import { Plato } from "@/components/Plato";
import { obtenerReceta } from "@/lib/mealdb";
import { etiquetaArea, etiquetaCategoria } from "@/lib/traducciones";

const ID_VALIDO = /^\d+$/;

export async function generateMetadata({ params }: PageProps<"/recetas/[id]">): Promise<Metadata> {
  const { id } = await params;
  const receta = ID_VALIDO.test(id) ? await obtenerReceta(id) : null;
  if (!receta) return { title: "Receta no encontrada" };

  return {
    title: receta.nombre,
    description: `Ingredientes y pasos para preparar ${receta.nombre} (${etiquetaArea(receta.area)}).`,
    openGraph: { images: [receta.imagen] },
  };
}

export default function PaginaReceta({ params }: PageProps<"/recetas/[id]">) {
  // El id solo se conoce en la petición: se lee dentro de Suspense para que
  // Next.js pueda servir al instante el "App Shell" con el esqueleto.
  return (
    <Suspense fallback={<EsqueletoDetalle />}>
      <DetalleReceta params={params} />
    </Suspense>
  );
}

async function DetalleReceta({ params }: Pick<PageProps<"/recetas/[id]">, "params">) {
  const { id } = await params;
  if (!ID_VALIDO.test(id)) notFound();

  const receta = await obtenerReceta(id);
  if (!receta) notFound();

  return (
    <article className="pt-8 md:pt-12">
      <Link href="/recetas" className="text-sm font-semibold text-cilantro hover:underline">
        Volver a recetas
      </Link>

      <div className="mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14">
        <div className="md:sticky md:top-8">
          <Plato
            src={receta.imagen}
            alt={receta.nombre}
            sizes="(min-width: 768px) 40vw, 90vw"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {receta.categoria && (
              <Link
                href={`/categorias/${receta.categoria}`}
                className="rounded-full bg-tinta px-3.5 py-1 text-sm font-medium text-niebla hover:bg-cilantro"
              >
                {etiquetaCategoria(receta.categoria)}
              </Link>
            )}
            {receta.area && (
              <span className="rounded-full border border-jamaica/40 px-3.5 py-1 text-sm font-medium text-jamaica">
                {etiquetaArea(receta.area)}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em] sm:text-6xl">
            {receta.nombre}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Solo pasamos al cliente los datos que necesita (no toda la receta) */}
            <BotonFavorito
              receta={{
                id: receta.id,
                nombre: receta.nombre,
                imagen: receta.imagen,
                categoria: receta.categoria,
                area: receta.area,
              }}
            />
            {receta.video && (
              <a
                href={receta.video}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-tinta px-5 py-2.5 font-semibold hover:bg-tinta hover:text-niebla"
              >
                Ver video en YouTube
              </a>
            )}
          </div>

          <section aria-labelledby="titulo-ingredientes" className="mt-12">
            <h2 id="titulo-ingredientes" className="text-3xl font-bold">
              Ingredientes
            </h2>
            <ListaIngredientes ingredientes={receta.ingredientes} />
          </section>

          <section aria-labelledby="titulo-preparacion" className="mt-12">
            <h2 id="titulo-preparacion" className="text-3xl font-bold">
              Preparación
            </h2>
            <ol className="mt-6 space-y-6">
              {receta.instrucciones.map((paso, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-full bg-maiz font-display text-lg font-bold"
                  >
                    {i + 1}
                  </span>
                  <p className="max-w-prose pt-1.5">{paso}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-piedra">
              Receta original en inglés, tomada de TheMealDB
              {receta.fuente && (
                <>
                  {" "}
                  (
                  <a href={receta.fuente} className="underline underline-offset-4" rel="noopener noreferrer">
                    fuente
                  </a>
                  )
                </>
              )}
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
