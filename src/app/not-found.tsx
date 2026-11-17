import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="max-w-xl pt-16">
      <div className="grid size-28 place-items-center rounded-full border-2 border-dashed border-borde bg-plato/60 font-display text-3xl font-extrabold text-piedra">
        404
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
        Este plato no está en el menú
      </h1>
      <p className="mt-3 text-lg text-piedra">
        La receta o página que buscas no existe o cambió de dirección.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/recetas"
          className="rounded-full bg-cilantro px-5 py-2.5 font-semibold text-white hover:bg-cilantro-oscuro"
        >
          Buscar recetas
        </Link>
        <Link href="/" className="rounded-full border border-tinta px-5 py-2.5 font-semibold">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
