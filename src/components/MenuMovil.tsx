"use client";

import { useEffect, useState } from "react";

import { NavEnlaces } from "@/components/NavEnlaces";

export function MenuMovil() {
  const [abierto, setAbierto] = useState(false);

  // Mientras el menú está abierto: cerrar con Escape y bloquear el scroll del fondo
  useEffect(() => {
    if (!abierto) return;

    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAbierto(false);
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", alPresionar);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", alPresionar);
    };
  }, [abierto]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="menu-movil"
        className="grid size-11 place-items-center rounded-full border border-borde bg-plato"
      >
        <span className="sr-only">{abierto ? "Cerrar menú" : "Abrir menú"}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          {abierto ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] border-t border-borde bg-niebla px-5 py-6"
        >
          <NavEnlaces vertical alNavegar={() => setAbierto(false)} />
        </nav>
      )}
    </div>
  );
}
