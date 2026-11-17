"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { EsqueletoGrilla } from "@/components/Esqueletos";
import { GrillaRecetas } from "@/components/GrillaRecetas";
import type { RespuestaBusqueda, RespuestaError } from "@/types/receta";

type OpcionCategoria = { valor: string; etiqueta: string };
type Estado = "cargando" | "listo" | "error";

const ESPERA_MS = 400; // debounce para no llamar a la API en cada tecla

/**
 * Client Component: búsqueda en vivo contra nuestro Route Handler /api/recetas.
 * - useState: término, categoría, resultados y estado de la petición.
 * - useEffect: debounce + AbortController para cancelar peticiones viejas,
 *   y sincronización de la URL para que la búsqueda se pueda compartir.
 */
export function ExploradorRecetas({ categorias }: { categorias: OpcionCategoria[] }) {
  const parametros = useSearchParams();
  const [termino, setTermino] = useState(() => parametros.get("q") ?? "");
  const [categoria, setCategoria] = useState(() => parametros.get("categoria") ?? "");
  const [resultado, setResultado] = useState<RespuestaBusqueda | null>(null);
  const [estado, setEstado] = useState<Estado>("cargando");
  const [error, setError] = useState("");
  const [intento, setIntento] = useState(0);

  const terminoLimpio = termino.trim();
  const sinFiltros = terminoLimpio === "" && categoria === "";

  useEffect(() => {
    const query = new URLSearchParams();
    if (terminoLimpio) query.set("q", terminoLimpio);
    if (categoria) query.set("categoria", categoria);
    const cadena = query.toString();

    // Actualiza la URL sin recargar ni agregar entradas al historial
    window.history.replaceState(null, "", cadena ? `/recetas?${cadena}` : "/recetas");

    if (sinFiltros) return;

    const controlador = new AbortController();
    const temporizador = setTimeout(
      async () => {
        setEstado("cargando");
        setError("");
        try {
          const respuesta = await fetch(`/api/recetas?${cadena}`, { signal: controlador.signal });
          const cuerpo = (await respuesta.json()) as RespuestaBusqueda | RespuestaError;
          if (!respuesta.ok || "error" in cuerpo) {
            throw new Error("error" in cuerpo ? cuerpo.error : "No pudimos cargar las recetas.");
          }
          setResultado(cuerpo);
          setEstado("listo");
        } catch (e) {
          if (controlador.signal.aborted) return;
          setError(e instanceof Error ? e.message : "No pudimos cargar las recetas.");
          setEstado("error");
        }
      },
      terminoLimpio ? ESPERA_MS : 0,
    );

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [terminoLimpio, categoria, sinFiltros, intento]);

  function limpiar() {
    setTermino("");
    setCategoria("");
  }

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="relative max-w-xl">
          <label htmlFor="busqueda" className="sr-only">
            Buscar recetas por nombre o ingrediente
          </label>
          <input
            id="busqueda"
            type="search"
            value={termino}
            maxLength={60}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Busca un plato: lasaña, salmón, pollo…"
            autoComplete="off"
            className="h-14 w-full rounded-full border border-borde bg-plato px-6 text-lg placeholder:text-piedra/70 focus:border-cilantro focus:outline-none focus-visible:outline-3 focus-visible:outline-maiz"
          />
        </div>

        <fieldset className="min-w-0">
          <legend className="sr-only">Filtrar por categoría</legend>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            <Chip activo={categoria === ""} onClick={() => setCategoria("")}>
              Todas
            </Chip>
            {categorias.map((c) => (
              <Chip key={c.valor} activo={categoria === c.valor} onClick={() => setCategoria(c.valor)}>
                {c.etiqueta}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-10" aria-live="polite" aria-busy={!sinFiltros && estado === "cargando"}>
        {sinFiltros ? (
          <Invitacion alElegir={setTermino} />
        ) : estado === "error" ? (
          <div className="max-w-xl rounded-3xl border border-jamaica/30 bg-plato p-6">
            <h2 className="text-2xl font-bold text-jamaica">No pudimos cargar las recetas</h2>
            <p className="mt-2 text-piedra">{error}</p>
            <button
              type="button"
              onClick={() => setIntento((n) => n + 1)}
              className="mt-4 rounded-full bg-tinta px-5 py-2.5 font-semibold text-niebla"
            >
              Intentar de nuevo
            </button>
          </div>
        ) : estado === "cargando" && !resultado ? (
          <>
            <p className="sr-only">Cargando recetas…</p>
            <EsqueletoGrilla />
          </>
        ) : resultado && resultado.total === 0 ? (
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold">
              No hay recetas{terminoLimpio ? ` para «${terminoLimpio}»` : ""}
            </h2>
            <p className="mt-2 text-piedra">
              Las recetas están en inglés: prueba con el nombre del plato en inglés, un término más
              corto o quita el filtro de categoría.
            </p>
            <button
              type="button"
              onClick={limpiar}
              className="mt-4 rounded-full border border-tinta px-5 py-2.5 font-semibold"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : resultado ? (
          <div className={estado === "cargando" ? "opacity-50 transition-opacity" : ""}>
            <p className="mb-8 text-piedra">
              <strong className="text-tinta">{resultado.total}</strong>{" "}
              {resultado.total === 1 ? "receta" : "recetas"}
              {resultado.terminoApi &&
                resultado.terminoApi.toLowerCase() !== terminoLimpio.toLowerCase() && (
                  <> (buscamos «{resultado.terminoApi}», porque las recetas están en inglés)</>
                )}
            </p>
            <GrillaRecetas recetas={resultado.recetas} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={[
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        activo
          ? "border-tinta bg-tinta text-niebla"
          : "border-borde bg-plato hover:border-cilantro hover:text-cilantro",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Invitacion({ alElegir }: { alElegir: (termino: string) => void }) {
  const ideas = ["pollo", "pasta", "salmón", "pastel", "sopa", "curry"];
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold">Empieza con un antojo</h2>
      <p className="mt-2 text-piedra">
        Escribe el nombre de un plato o elige una categoría. También entendemos algunas palabras en
        español, como pollo, arroz o postre.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {ideas.map((idea) => (
          <button
            key={idea}
            type="button"
            onClick={() => alElegir(idea)}
            className="rounded-full bg-maiz-claro px-4 py-1.5 text-sm font-medium hover:bg-maiz"
          >
            {idea}
          </button>
        ))}
      </div>
    </div>
  );
}
