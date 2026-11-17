"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: unknown;
  retry: () => void;
  titulo?: string;
};

/** UI compartida por los archivos error.tsx de cada segmento. */
export function PanelError({ error, retry, titulo = "No pudimos cargar esta página" }: Props) {
  useEffect(() => {
    // Aquí se conectaría un servicio de monitoreo (Sentry, etc.)
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String(error.digest) : null;

  return (
    <div role="alert" className="max-w-xl pt-16">
      <div className="grid size-24 place-items-center rounded-full border-2 border-dashed border-jamaica/50">
        <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 7v6m0 4h.01" stroke="#8e2d56" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.03em]">{titulo}</h1>
      <p className="mt-3 text-lg text-piedra">
        El servicio de recetas no respondió como esperábamos. Suele ser temporal: vuelve a intentarlo
        en unos segundos.
      </p>
      {digest && <p className="mt-2 text-sm text-piedra">Código de referencia: {digest}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-cilantro px-5 py-2.5 font-semibold text-white hover:bg-cilantro-oscuro"
        >
          Intentar de nuevo
        </button>
        <Link href="/" className="rounded-full border border-tinta px-5 py-2.5 font-semibold">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
