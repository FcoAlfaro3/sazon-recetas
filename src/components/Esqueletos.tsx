// Esqueletos para los estados de carga (loading.tsx y <Suspense fallback>)

export function EsqueletoGrilla({ cantidad = 8 }: { cantidad?: number }) {
  return (
    <ul
      className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: cantidad }, (_, i) => (
        <li key={i}>
          <div className="aspect-square rounded-full bg-niebla-2 motion-safe:animate-pulse" />
          <div className="mt-4 h-5 w-3/4 rounded-full bg-niebla-2 motion-safe:animate-pulse" />
          <div className="mt-2 h-4 w-1/2 rounded-full bg-niebla-2 motion-safe:animate-pulse" />
        </li>
      ))}
    </ul>
  );
}

export function EsqueletoTitulo() {
  return (
    <div aria-hidden="true" className="space-y-3">
      <div className="h-12 w-2/3 rounded-2xl bg-niebla-2 motion-safe:animate-pulse sm:h-16" />
      <div className="h-5 w-1/2 rounded-full bg-niebla-2 motion-safe:animate-pulse" />
    </div>
  );
}

export function EsqueletoDetalle() {
  return (
    <div className="grid gap-10 pt-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" aria-hidden="true">
      <div className="aspect-square rounded-full bg-niebla-2 motion-safe:animate-pulse" />
      <div className="space-y-6">
        <EsqueletoTitulo />
        <div className="space-y-3">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="h-5 rounded-full bg-niebla-2 motion-safe:animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Cargando({ texto }: { texto: string }) {
  return (
    <p role="status" className="sr-only">
      {texto}
    </p>
  );
}
