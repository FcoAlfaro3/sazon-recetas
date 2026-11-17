import type { Metadata } from "next";
import Link from "next/link";

import { SITIO } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Cómo se hizo",
  description: "Arquitectura del proyecto y proceso de Vibe Coding con IA.",
};

const RUTAS = [
  { ruta: "/", tipo: "Server + Client", detalle: "Hero y categorías prerenderizadas; receta sorpresa interactiva." },
  { ruta: "/recetas", tipo: "Server + Client", detalle: "Búsqueda en vivo con useState y useEffect contra /api/recetas." },
  { ruta: "/recetas/[id]", tipo: "Server + Client", detalle: "Detalle con streaming; ingredientes marcables y favoritos." },
  { ruta: "/categorias", tipo: "Server", detalle: "Lista cacheada con «use cache», se revalida cada día." },
  { ruta: "/categorias/[nombre]", tipo: "Server", detalle: "Rutas generadas en el build con generateStaticParams." },
  { ruta: "/favoritos", tipo: "Client", detalle: "Favoritos en localStorage sincronizados entre pestañas." },
];

const ENDPOINTS = [
  ["GET /api/recetas?q=&categoria=", "Busca por nombre y/o categoría"],
  ["GET /api/recetas/[id]", "Detalle de una receta"],
  ["GET /api/recetas/aleatoria", "Una receta al azar, sin caché"],
  ["GET /api/categorias", "Lista de categorías"],
];

export default function PaginaAcerca() {
  return (
    <div className="max-w-3xl pt-12 md:pt-16">
      <h1 className="text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">Cómo se hizo</h1>
      <p className="mt-6 text-lg">
        Sazón es un proyecto académico construido con <strong>Next.js 16</strong> (App Router),{" "}
        <strong>TypeScript</strong> y <strong>Tailwind CSS 4</strong>, usando Vibe Coding: una IA
        actuó como copiloto para generar código y diseño, y cada propuesta se revisó, se probó y se
        corrigió antes de integrarla.
      </p>

      <h2 className="mt-14 text-3xl font-bold">Rutas</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left">
          <thead className="border-b-2 border-tinta text-sm">
            <tr>
              <th className="py-2 pr-4 font-semibold">Ruta</th>
              <th className="py-2 pr-4 font-semibold">Componentes</th>
              <th className="py-2 font-semibold">Qué hace</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {RUTAS.map((r) => (
              <tr key={r.ruta}>
                <td className="py-3 pr-4 font-mono text-sm">{r.ruta}</td>
                <td className="py-3 pr-4 text-sm">{r.tipo}</td>
                <td className="py-3 text-piedra">{r.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-14 text-3xl font-bold">API interna</h2>
      <p className="mt-3 text-piedra">
        El navegador nunca llama directo a TheMealDB: lo hace a través de Route Handlers propios,
        que guardan la clave en el servidor, validan los parámetros y traducen búsquedas comunes del
        español al inglés.
      </p>
      <ul className="mt-6 divide-y divide-borde border-y border-borde">
        {ENDPOINTS.map(([endpoint, descripcion]) => (
          <li key={endpoint} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
            <code className="text-sm">{endpoint}</code>
            <span className="text-piedra">{descripcion}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-3xl font-bold">Proceso con IA</h2>
      <p className="mt-3 text-piedra">
        Los prompts, las iteraciones y los errores que hubo que corregir están documentados en el
        archivo VIBE_CODING.md del repositorio.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={SITIO.repositorio}
          className="rounded-full bg-tinta px-5 py-2.5 font-semibold text-niebla hover:bg-cilantro"
        >
          Ver el código en GitHub
        </a>
        <Link href="/recetas" className="rounded-full border border-tinta px-5 py-2.5 font-semibold">
          Probar el buscador
        </Link>
      </div>
    </div>
  );
}
