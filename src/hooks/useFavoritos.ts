"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { RecetaResumen } from "@/types/receta";

/**
 * Favoritos guardados en localStorage.
 *
 * Se usa useSyncExternalStore (en vez de useState + useEffect) porque
 * localStorage es un "store" externo a React: así todos los componentes
 * (contador del encabezado, botón de la receta, página de favoritos)
 * se mantienen sincronizados, incluso entre pestañas, y se evita el
 * desajuste de hidratación entre servidor y cliente.
 */

const CLAVE = "sazon:favoritos";
const EVENTO = "sazon:favoritos-cambiaron";
const VACIO: RecetaResumen[] = [];

let cacheTexto: string | null = null;
let cacheLista: RecetaResumen[] = VACIO;

function leer(): RecetaResumen[] {
  let texto: string | null = null;
  try {
    texto = window.localStorage.getItem(CLAVE);
  } catch {
    return VACIO;
  }
  // Devolver la misma referencia si nada cambió (requisito de useSyncExternalStore)
  if (texto === cacheTexto) return cacheLista;
  cacheTexto = texto;
  try {
    const datos: unknown = texto ? JSON.parse(texto) : [];
    cacheLista = Array.isArray(datos) ? (datos as RecetaResumen[]) : VACIO;
  } catch {
    cacheLista = VACIO;
  }
  return cacheLista;
}

function escribir(lista: RecetaResumen[]) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(lista));
  } catch {
    // Modo privado o almacenamiento lleno: no bloqueamos la interfaz
  }
  window.dispatchEvent(new Event(EVENTO));
}

function suscribir(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar); // cambios desde otra pestaña
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

export function useFavoritos() {
  const favoritos = useSyncExternalStore(suscribir, leer, () => VACIO);

  const esFavorito = useCallback((id: string) => favoritos.some((f) => f.id === id), [favoritos]);

  const alternar = useCallback((receta: RecetaResumen) => {
    const actuales = leer();
    const existe = actuales.some((f) => f.id === receta.id);
    const resumen: RecetaResumen = {
      id: receta.id,
      nombre: receta.nombre,
      imagen: receta.imagen,
      categoria: receta.categoria,
      area: receta.area,
    };
    escribir(existe ? actuales.filter((f) => f.id !== receta.id) : [resumen, ...actuales]);
  }, []);

  const quitar = useCallback((id: string) => {
    escribir(leer().filter((f) => f.id !== id));
  }, []);

  const vaciar = useCallback(() => escribir([]), []);

  return { favoritos, esFavorito, alternar, quitar, vaciar };
}
