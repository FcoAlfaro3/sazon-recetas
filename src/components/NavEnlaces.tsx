"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ContadorFavoritos } from "@/components/ContadorFavoritos";
import { NAVEGACION } from "@/lib/sitio";

type Props = {
  vertical?: boolean;
  alNavegar?: () => void;
};

export function NavEnlaces({ vertical = false, alNavegar }: Props) {
  const ruta = usePathname();

  return (
    <ul className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      {NAVEGACION.map(({ href, etiqueta }) => {
        const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={alNavegar}
              aria-current={activo ? "page" : undefined}
              className={[
                "flex items-center gap-2 rounded-full font-medium transition-colors",
                vertical ? "px-4 py-3 text-xl" : "px-3.5 py-1.5 text-[0.95rem]",
                activo
                  ? "bg-tinta text-niebla"
                  : "text-tinta hover:bg-niebla-2",
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
