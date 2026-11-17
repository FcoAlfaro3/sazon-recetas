import "server-only";

import { MealDBError } from "@/lib/mealdb";
import type { RespuestaError } from "@/types/receta";

export function respuestaError(mensaje: string, status: number) {
  return Response.json({ error: mensaje } satisfies RespuestaError, { status });
}

/**
 * Convierte cualquier error en una respuesta JSON con un mensaje útil.
 *
 * Ojo: los errores que salen de una función con "use cache" se serializan
 * y en producción llegan como un Error genérico (con `digest`), no como
 * MealDBError. Por eso el caso por defecto asume que falló el servicio
 * externo (502) y no un bug nuestro (500).
 */
export function manejarError(error: unknown) {
  if (error instanceof MealDBError) {
    return respuestaError(error.message, error.status);
  }
  console.error("[api] Error al consultar TheMealDB:", error);
  return respuestaError(
    "El servicio de recetas no respondió. Intenta de nuevo en unos segundos.",
    502,
  );
}
