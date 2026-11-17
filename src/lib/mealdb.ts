import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { Categoria, Ingrediente, Receta, RecetaResumen } from "@/types/receta";

/**
 * Servicio de acceso a TheMealDB (https://www.themealdb.com/api.php).
 *
 * - Solo se ejecuta en el servidor (`server-only`), así la API key nunca
 *   llega al navegador.
 * - Las funciones de lectura usan la directiva `"use cache"` de Cache
 *   Components (Next.js 16) para no consultar la API en cada visita.
 * - Normaliza la respuesta cruda de la API a los tipos de dominio.
 */

const URL_POR_DEFECTO = "https://www.themealdb.com/api/json/v1";
const TIEMPO_LIMITE_MS = 8000;

export class MealDBError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
    this.name = "MealDBError";
  }
}

// ---- Formas crudas de la API ----------------------------------------------

type MealCrudo = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  strTags?: string | null;
  strYoutube?: string | null;
  strSource?: string | null;
} & Record<string, string | null | undefined>;

type CategoriaCruda = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

// ---- Utilidades -------------------------------------------------------------

function configuracion() {
  const clave = process.env.MEALDB_API_KEY;
  if (!clave) {
    throw new MealDBError(
      "Falta la variable de entorno MEALDB_API_KEY. Copia .env.example como .env.local y complétala.",
      500,
    );
  }
  const base = (process.env.MEALDB_API_URL || URL_POR_DEFECTO).replace(/\/+$/, "");
  return { base, clave };
}

async function solicitar<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const { base, clave } = configuracion();
  const url = new URL(`${base}/${clave}/${endpoint}`);
  for (const [nombre, valor] of Object.entries(params)) {
    url.searchParams.set(nombre, valor);
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(url, { signal: AbortSignal.timeout(TIEMPO_LIMITE_MS) });
  } catch {
    throw new MealDBError("No se pudo conectar con TheMealDB. Intenta de nuevo en unos segundos.", 503);
  }

  if (!respuesta.ok) {
    throw new MealDBError(`TheMealDB respondió con el estado ${respuesta.status}.`, 502);
  }

  try {
    return (await respuesta.json()) as T;
  } catch {
    throw new MealDBError("TheMealDB devolvió una respuesta que no es JSON válido.", 502);
  }
}

/** La API devuelve `null` (o a veces un texto) cuando no hay resultados. */
function comoLista<T>(valor: unknown): T[] {
  return Array.isArray(valor) ? (valor as T[]) : [];
}

function extraerIngredientes(meal: MealCrudo): Ingrediente[] {
  const ingredientes: Ingrediente[] = [];
  for (let i = 1; i <= 20; i++) {
    const nombre = meal[`strIngredient${i}`]?.trim();
    const medida = meal[`strMeasure${i}`]?.trim() ?? "";
    if (nombre) ingredientes.push({ nombre, medida });
  }
  return ingredientes;
}

function extraerPasos(texto?: string | null): string[] {
  if (!texto) return [];
  return texto
    .split(/\r?\n+/)
    .map((linea) => linea.replace(/^\s*(step\s*\d+[:.)]?|\d+[.)])\s*/i, "").trim())
    .filter((linea) => linea.length > 0 && !/^\d+$/.test(linea));
}

function aResumen(meal: MealCrudo): RecetaResumen {
  return {
    id: meal.idMeal,
    nombre: meal.strMeal,
    imagen: meal.strMealThumb,
    categoria: meal.strCategory ?? undefined,
    area: meal.strArea ?? undefined,
  };
}

function aReceta(meal: MealCrudo): Receta {
  return {
    ...aResumen(meal),
    categoria: meal.strCategory ?? "",
    area: meal.strArea ?? "",
    instrucciones: extraerPasos(meal.strInstructions),
    ingredientes: extraerIngredientes(meal),
    etiquetas: (meal.strTags ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    video: meal.strYoutube || null,
    fuente: meal.strSource || null,
  };
}

// ---- Funciones públicas (cacheadas) ----------------------------------------

export async function obtenerCategorias(): Promise<Categoria[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categorias");

  const datos = await solicitar<{ categories: unknown }>("categories.php");
  return comoLista<CategoriaCruda>(datos.categories).map((c) => ({
    id: c.idCategory,
    nombre: c.strCategory,
    imagen: c.strCategoryThumb,
    descripcion: c.strCategoryDescription,
  }));
}

export async function obtenerReceta(id: string): Promise<Receta | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`receta-${id}`);

  const datos = await solicitar<{ meals: unknown }>("lookup.php", { i: id });
  const [meal] = comoLista<MealCrudo>(datos.meals);
  return meal ? aReceta(meal) : null;
}

export async function buscarRecetas(termino: string): Promise<RecetaResumen[]> {
  "use cache";
  cacheLife("hours");

  const datos = await solicitar<{ meals: unknown }>("search.php", { s: termino });
  return comoLista<MealCrudo>(datos.meals).map(aResumen);
}

export async function recetasPorCategoria(categoria: string): Promise<RecetaResumen[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(`categoria-${categoria}`);

  const datos = await solicitar<{ meals: unknown }>("filter.php", { c: categoria });
  // filter.php solo devuelve id, nombre e imagen: completamos la categoría
  return comoLista<MealCrudo>(datos.meals).map((m) => ({ ...aResumen(m), categoria }));
}

/** Sin caché a propósito: cada llamada debe devolver una receta distinta. */
export async function recetaAleatoria(): Promise<Receta> {
  const datos = await solicitar<{ meals: unknown }>("random.php");
  const [meal] = comoLista<MealCrudo>(datos.meals);
  if (!meal) throw new MealDBError("TheMealDB no devolvió ninguna receta.", 502);
  return aReceta(meal);
}
