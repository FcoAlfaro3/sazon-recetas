"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { ContadorFavoritos } from "@/components/ContadorFavoritos";
import { NAVEGACION } from "@/lib/sitio";

type Props = {
  vertical?: boolean;
  alNavegar?: () => void;
};

/**
 * Con Cache Components, usePathname() en rutas dinámicas (/recetas/[id])
 * solo se conoce en la petición. Si se lee fuera de <Suspense> bloquea el
 * prerenderizado, así que mostramos primero los enlaces sin marca de
 * "activo" y la ruta actual llega en streaming.
 */
export function NavEnlaces(props: Props) {
  return (
    <Suspense fallback={<ListaEnlaces ruta={null} {...props} />}>
      <EnlacesConRuta {...props} />
    </Suspense>
  );
}

function EnlacesConRuta(props: Props) {
  const ruta = usePathname();
  return <ListaEnlaces ruta={ruta} {...props} />;
}

function ListaEnlaces({ ruta, vertical = false, alNavegar }: Props & { ruta: string | null }) {
  return (
    <ul className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      {NAVEGACION.map(({ href, etiqueta }) => {
        const activo =
          ruta !== null && (href === "/" ? ruta === "/" : ruta === href || ruta.startsWith(`${href}/`));
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={alNavegar}
              aria-current={activo ? "page" : undefined}
              className={[
                "flex items-center gap-2 rounded-full font-medium transition-colors",
                vertical ? "px-4 py-3 text-xl" : "px-3.5 py-1.5 text-[0.95rem]",
                activo ? "bg-tinta text-niebla" : "text-tinta hover:bg-niebla-2",
              ].join(" ")}
            >
              {etiqueta}
              {href === "/favoritos" && <ContadorFavoritos activo={activo} />}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
