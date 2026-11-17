import "server-only";

import { MealDBError } from "@/lib/mealdb";
import type { RespuestaError } from "@/types/receta";

export function respuestaError(mensaje: string, status: number) {
  return Response.json({ error: mensaje } satisfies RespuestaError, { status });
}

/** Convierte cualquier error en una respuesta JSON con un mensaje útil. */
export function manejarError(error: unknown) {
  if (error instanceof MealDBError) {
    return respuestaError(error.message, error.status);
  }
  console.error("[api] Error inesperado:", error);
  return respuestaError("Ocurrió un error inesperado en el servidor.", 500);
}
