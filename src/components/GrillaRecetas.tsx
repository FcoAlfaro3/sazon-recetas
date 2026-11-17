import Link from "next/link";

import { Plato } from "@/components/Plato";
import { etiquetaArea, etiquetaCategoria } from "@/lib/traducciones";
import type { RecetaResumen } from "@/types/receta";

type Props = {
  recetas: RecetaResumen[];
  /** Acción extra opcional por receta (p. ej. "Quitar" en favoritos) */
  accion?: (receta: RecetaResumen) => React.ReactNode;
};

// Componente sin estado: puede renderizarse tanto desde Server como desde Client Components
export function GrillaRecetas({ recetas, accion }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {recetas.map((receta, indice) => (
        <li key={receta.id} className="group relative">
          <Link href={`/recetas/${receta.id}`} className="block rounded-3xl">
            <Plato
              src={receta.imagen}
              alt=""
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 30vw, 45vw"
              priority={indice < 4}
              className="transition-transform duration-300 group-hover:-rotate-6"
            />
            <h3 className="mt-4 font-display text-lg font-semibold leading-tight group-hover:text-cilantro sm:text-xl">
              {receta.nombre}
            </h3>
          </Link>
          {(receta.categoria || receta.area) && (
            <p className="mt-1 text-sm text-piedra">
              {[etiquetaCategoria(receta.categoria), etiquetaArea(receta.area)]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
          {accion && <div className="mt-3">{accion(receta)}</div>}
        </li>
      ))}
    </ul>
  );
}
