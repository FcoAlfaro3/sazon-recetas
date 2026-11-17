import { Cargando, EsqueletoDetalle } from "@/components/Esqueletos";

export default function LoadingReceta() {
  return (
    <>
      <Cargando texto="Cargando receta…" />
      <EsqueletoDetalle />
    </>
  );
}
