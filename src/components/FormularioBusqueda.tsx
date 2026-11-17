import Form from "next/form";

// <Form> de Next.js: funciona sin JavaScript (GET a /recetas?q=...) y,
// con JavaScript, navega del lado del cliente con prefetch.
export function FormularioBusqueda({ className = "" }: { className?: string }) {
  return (
    <Form action="/recetas" role="search" className={`flex w-full max-w-xl gap-2 ${className}`}>
      <label htmlFor="busqueda-inicio" className="sr-only">
        Buscar recetas por nombre o ingrediente
      </label>
      <input
        id="busqueda-inicio"
        name="q"
        type="search"
        required
        maxLength={60}
        placeholder="Lasaña, salmón, pollo…"
        className="h-14 min-w-0 flex-1 rounded-full border border-borde bg-plato px-6 text-lg placeholder:text-piedra/70 focus:border-cilantro focus:outline-none focus-visible:outline-3 focus-visible:outline-maiz"
      />
      <button
        type="submit"
        className="h-14 shrink-0 rounded-full bg-cilantro px-6 font-semibold text-white hover:bg-cilantro-oscuro"
      >
        Buscar
      </button>
    </Form>
  );
}
