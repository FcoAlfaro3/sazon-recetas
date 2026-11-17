import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EsqueletoGrilla, EsqueletoTitulo } from "@/components/Esqueletos";
import { GrillaRecetas } from "@/components/GrillaRecetas";
import { Plato } from "@/components/Plato";
import { obtenerCategorias, recetasPorCategoria } from "@/lib/mealdb";
import { etiquetaCategoria } from "@/lib/traducciones";

async function buscarCategoria(nombre: string) {
  const categorias = await obtenerCategorias();
  return categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase()) ?? null;
}

// Prerenderiza en el build todas las categorías conocidas (son pocas y estables)
export async function generateStaticParams() {
  const categorias = await obtenerCategorias();
  return categorias.map((c) => ({ nombre: c.nombre }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categorias/[nombre]">): Promise<Metadata> {
  const { nombre } = await params;
  const categoria = await buscarCategoria(decodeURIComponent(nombre));
  if (!categoria) return { title: "Categoría no encontrada" };
  const etiqueta = etiquetaCategoria(categoria.nombre);
  return {
    title: `Recetas de ${etiqueta.toLowerCase()}`,
    description: `Todas las recetas de la categoría ${etiqueta}.`,
  };
}

export default function PaginaCategoria({ params }: PageProps<"/categorias/[nombre]">) {
  return (
    <Suspense
      fallback={
        <div className="space-y-12 pt-12">
          <EsqueletoTitulo />
          <EsqueletoGrilla />
        </div>
      }
    >
      <DetalleCategoria params={params} />
    </Suspense>
  );
}

async function DetalleCategoria({ params }: Pick<PageProps<"/categorias/[nombre]">, "params">) {
  const { nombre } = await params;
  const categoria = await buscarCategoria(decodeURIComponent(nombre));
  if (!categoria) notFound();

  const recetas = await recetasPorCategoria(categoria.nombre);
  const etiqueta = etiquetaCategoria(categoria.nombre);

  return (
    <>
      <header className="grid items-center gap-8 pt-10 pb-12 sm:grid-cols-[10rem_1fr] md:pt-14">
        <Plato src={categoria.imagen} alt="" sizes="160px" priority className="w-32 sm:w-40" />
        <div>
          <Link href="/categorias" className="text-sm font-semibold text-cilantro hover:underline">
            Todas las categorías
          </Link>
          <h1 className="mt-2 text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">{etiqueta}</h1>
          <p className="mt-3 text-lg text-piedra">
            {recetas.length} {recetas.length === 1 ? "receta" : "recetas"}
          </p>
        </div>
      </header>

      {recetas.length > 0 ? (
        <GrillaRecetas recetas={recetas} />
      ) : (
        <p className="text-piedra">Todavía no hay recetas en esta categoría.</p>
      )}
    </>
  );
}
