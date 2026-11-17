import type { NextRequest } from "next/server";

import { manejarError, respuestaError } from "@/lib/api-respuestas";
import { buscarRecetas, recetasPorCategoria } from "@/lib/mealdb";
import { traducirBusqueda } from "@/lib/traducciones";
import type { RespuestaBusqueda } from "@/types/receta";

const LARGO_MAXIMO = 60;

/**
 * GET /api/recetas?q=pollo&categoria=Chicken
 * Busca recetas por nombre, por categoría o por ambos.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const categoria = request.nextUrl.searchParams.get("categoria")?.trim() ?? "";

  if (!q && !categoria) {
    return respuestaError("Indica un término de búsqueda (q) o una categoría.", 400);
  }
  if (q.length > LARGO_MAXIMO || categoria.length > LARGO_MAXIMO) {
    return respuestaError(`Los filtros no pueden superar ${LARGO_MAXIMO} caracteres.`, 400);
  }

  try {
    let recetas;
    let terminoApi: string | null = null;

    if (q) {
      terminoApi = traducirBusqueda(q);
      recetas = await buscarRecetas(terminoApi);
      if (categoria) recetas = recetas.filter((r) => r.categoria === categoria);
    } else {
      recetas = await recetasPorCategoria(categoria);
    }

    const cuerpo: RespuestaBusqueda = { recetas, total: recetas.length, terminoApi };
    return Response.json(cuerpo);
  } catch (error) {
    return manejarError(error);
  }
}
