import Link from "next/link";

import { SITIO } from "@/lib/sitio";

export function PiePagina() {
  return (
    <footer className="border-t border-borde">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-piedra sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          Recetas e imágenes de{" "}
          <a href="https://www.themealdb.com" className="font-medium text-tinta underline underline-offset-4">
            TheMealDB
          </a>
          . Proyecto académico construido con Next.js y Vibe Coding.
        </p>
        <div className="flex gap-5">
          <Link href="/acerca" className="hover:text-tinta">
            Cómo se hizo
          </Link>
          <a href={SITIO.repositorio} className="hover:text-tinta">
            Código en GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
