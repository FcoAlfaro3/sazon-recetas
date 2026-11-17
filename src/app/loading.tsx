import { Cargando, EsqueletoGrilla, EsqueletoTitulo } from "@/components/Esqueletos";

// Loading UI genérico: se muestra mientras un segmento sin su propio
// loading.tsx espera datos.
export default function Loading() {
  return (
    <div className="space-y-12 pt-12 md:pt-16">
      <Cargando texto="Cargando…" />
      <EsqueletoTitulo />
      <EsqueletoGrilla />
    </div>
  );
}
