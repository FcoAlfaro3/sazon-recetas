import type { NextRequest } from "next/server";

import { manejarError, respuestaError } from "@/lib/api-respuestas";
import { obtenerReceta } from "@/lib/mealdb";

/** GET /api/recetas/52772 — detalle completo de una receta. */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/recetas/[id]">) {
  const { id } = await ctx.params;

  if (!/^\d+$/.test(id)) {
    return respuestaError("El id de la receta debe ser numérico.", 400);
  }

  try {
    const receta = await obtenerReceta(id);
    if (!receta) return respuestaError(`No existe una receta con id ${id}.`, 404);
    return Response.json(receta);
  } catch (error) {
    return manejarError(error);
  }
}
