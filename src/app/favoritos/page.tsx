import type { Metadata } from "next";

import { ListaFavoritos } from "@/components/ListaFavoritos";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Las recetas que guardaste para cocinar después.",
};

// La página es un Server Component estático; la lista vive en el
// navegador (localStorage), así que se delega a un Client Component.
export default function PaginaFavoritos() {
  return (
    <>
      <header className="pt-12 pb-10 md:pt-16">
        <h1 className="text-5xl font-extrabold tracking-[-0.03em] sm:text-6xl">Mis favoritos</h1>
        <p className="mt-3 max-w-xl text-lg text-piedra">
          Se guardan en este navegador, sin crear una cuenta.
        </p>
      </header>
      <ListaFavoritos />
    </>
  );
}
