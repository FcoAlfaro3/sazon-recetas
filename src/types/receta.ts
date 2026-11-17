// Tipos de dominio de la app. Se usan nombres en español y se desacoplan
// de la forma "cruda" en que responde TheMealDB (ver src/lib/mealdb.ts).

export interface RecetaResumen {
  id: string;
  nombre: string;
  imagen: string;
  categoria?: string;
  area?: string;
}

export interface Ingrediente {
  nombre: string;
  medida: string;
}

export interface Receta extends RecetaResumen {
  categoria: string;
  area: string;
  instrucciones: string[];
  ingredientes: Ingrediente[];
  etiquetas: string[];
  video: string | null;
  fuente: string | null;
}

export interface Categoria {
  id: string;
  nombre: string;
  imagen: string;
  descripcion: string;
}

// Formas de respuesta de nuestros Route Handlers (/api/*)
export interface RespuestaBusqueda {
  recetas: RecetaResumen[];
  total: number;
  /** Término que realmente se envió a TheMealDB (puede venir traducido) */
  terminoApi: string | null;
}

export interface RespuestaError {
  error: string;
}
