"use client"; // Los error boundaries deben ser Client Components

import { PanelError } from "@/components/PanelError";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return <PanelError error={error} retry={retry} />;
}
