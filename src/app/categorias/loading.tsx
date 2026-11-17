import { Cargando, EsqueletoGrilla, EsqueletoTitulo } from "@/components/Esqueletos";

export default function LoadingCategorias() {
  return (
    <div className="space-y-12 pt-12 md:pt-16">
      <Cargando texto="Cargando categorías…" />
      <EsqueletoTitulo />
      <EsqueletoGrilla cantidad={10} />
    </div>
  );
}
