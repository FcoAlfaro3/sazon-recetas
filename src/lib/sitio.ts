export const SITIO = {
  nombre: "Sazón",
  descripcion:
    "Explora recetas de todo el mundo, busca por plato o ingrediente y guarda tus favoritas para cocinarlas después.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  repositorio: "https://github.com/FcoAlfaro3/sazon-recetas",
};

export const NAVEGACION = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/recetas", etiqueta: "Recetas" },
  { href: "/categorias", etiqueta: "Categorías" },
  { href: "/favoritos", etiqueta: "Favoritos" },
  { href: "/acerca", etiqueta: "Acerca" },
] as const;
