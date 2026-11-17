"use client";

import { useState } from "react";

import type { Ingrediente } from "@/types/receta";

/** Lista de ingredientes que se pueden marcar mientras se cocina. */
export function ListaIngredientes({ ingredientes }: { ingredientes: Ingrediente[] }) {
  const [listos, setListos] = useState<Set<number>>(() => new Set());

  function alternar(indice: number) {
    setListos((anterior) => {
      const siguiente = new Set(anterior);
      if (siguiente.has(indice)) siguiente.delete(indice);
      else siguiente.add(indice);
      return siguiente;
    });
  }

  const completos = listos.size === ingredientes.length && ingredientes.length > 0;

  return (
    <div className="mt-4">
      <p className="text-sm text-piedra" aria-live="polite">
        {completos
          ? "Tienes todo listo. ¡A cocinar!"
          : `Marca lo que ya tienes: ${listos.size} de ${ingredientes.length}`}
      </p>
      <ul className="mt-4 divide-y divide-borde border-y border-borde">
        {ingredientes.map((ingrediente, i) => {
          const marcado = listos.has(i);
          return (
            <li key={`${ingrediente.nombre}-${i}`}>
              <label className="flex cursor-pointer items-center gap-4 py-3">
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={() => alternar(i)}
                  className="size-5 shrink-0 accent-cilantro"
                />
                <span className={`flex-1 capitalize ${marcado ? "text-piedra line-through" : ""}`}>
                  {ingrediente.nombre}
                </span>
                <span className="text-right text-piedra">{ingrediente.medida}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
