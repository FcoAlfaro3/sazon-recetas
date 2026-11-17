import { manejarError } from "@/lib/api-respuestas";
import { obtenerCategorias } from "@/lib/mealdb";

/** GET /api/categorias — lista de categorías (cacheada por días). */
export async function GET() {
  try {
    const categorias = await obtenerCategorias();
    return Response.json({ categorias, total: categorias.length });
  } catch (error) {
    return manejarError(error);
  }
}
