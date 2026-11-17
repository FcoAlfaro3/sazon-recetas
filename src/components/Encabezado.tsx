import Link from "next/link";

import { MenuMovil } from "@/components/MenuMovil";
import { NavEnlaces } from "@/components/NavEnlaces";

// Server Component: el encabezado es estático; solo la navegación
// (ruta activa, menú móvil y contador de favoritos) vive en el cliente.
export function Encabezado() {
  return (
    <header className="relative z-30 border-b border-borde bg-niebla/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2" aria-label="Sazón, ir al inicio">
          <Logo />
          <span className="font-display text-2xl font-extrabold tracking-tight text-tinta">
            Sazón
          </span>
        </Link>
        <nav aria-label="Principal" className="hidden md:block">
          <NavEnlaces />
        </nav>
        <MenuMovil />
      </div>
    </header>
  );
}

function Logo() {
  // Un plato visto desde arriba con una hoja de cilantro
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#fff" stroke="#cfd9d0" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="10" fill="#f4c430" />
      <path d="M13 19c0-5 3-8 8-8 0 5-3 8-8 8Z" fill="#146b4a" />
      <path d="M13 19l5-5" stroke="#f4c430" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
