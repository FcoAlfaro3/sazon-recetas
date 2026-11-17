import { connection } from "next/server";

import { manejarError } from "@/lib/api-respuestas";
import { recetaAleatoria } from "@/lib/mealdb";

/** GET /api/recetas/aleatoria — una receta distinta en cada petición. */
export async function GET() {
  // Marca la ruta como dinámica: nunca debe prerenderizarse ni cachearse
  await connection();

  try {
    const receta = await recetaAleatoria();
    return Response.json(receta, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return manejarError(error);
  }
}
