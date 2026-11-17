"use client";

import { PanelError } from "@/components/PanelError";

export default function ErrorCategorias({ error, retry }: { error: unknown; retry: () => void }) {
  return <PanelError error={error} retry={retry} titulo="No pudimos cargar las categorías" />;
}
