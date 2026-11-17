// TheMealDB solo tiene contenido en inglés. Estas tablas permiten mostrar
// categorías y regiones en español y traducir búsquedas comunes.

const CATEGORIAS: Record<string, string> = {
  Beef: "Res",
  Breakfast: "Desayunos",
  Chicken: "Pollo",
  Dessert: "Postres",
  Goat: "Cabra",
  Lamb: "Cordero",
  Miscellaneous: "Variados",
  Pasta: "Pasta",
  Pork: "Cerdo",
  Seafood: "Mariscos",
  Side: "Acompañamientos",
  Starter: "Entradas",
  Vegan: "Veganos",
  Vegetarian: "Vegetarianos",
};

const AREAS: Record<string, string> = {
  Algerian: "Argelia",
  American: "Estados Unidos",
  Argentinian: "Argentina",
  Australian: "Australia",
  British: "Reino Unido",
  Canadian: "Canadá",
  Chinese: "China",
  Croatian: "Croacia",
  Dutch: "Países Bajos",
  Egyptian: "Egipto",
  Filipino: "Filipinas",
  French: "Francia",
  Greek: "Grecia",
  Indian: "India",
  Irish: "Irlanda",
  Italian: "Italia",
  Jamaican: "Jamaica",
  Japanese: "Japón",
  Kenyan: "Kenia",
  Malaysian: "Malasia",
  Mexican: "México",
  Moroccan: "Marruecos",
  Norwegian: "Noruega",
  Polish: "Polonia",
  Portuguese: "Portugal",
  Russian: "Rusia",
  "Saudi Arabian": "Arabia Saudita",
  Slovakian: "Eslovaquia",
  Spanish: "España",
  Syrian: "Siria",
  Thai: "Tailandia",
  Tunisian: "Túnez",
  Turkish: "Turquía",
  Ukrainian: "Ucrania",
  Uruguayan: "Uruguay",
  Venezulan: "Venezuela", // así viene escrito en la API
  Venezuelan: "Venezuela",
  Vietnamese: "Vietnam",
  Unknown: "Sin región",
};

// Palabras frecuentes en español → término equivalente en la API
const BUSQUEDAS: Record<string, string> = {
  pollo: "chicken",
  res: "beef",
  carne: "beef",
  cerdo: "pork",
  puerco: "pork",
  cordero: "lamb",
  pescado: "fish",
  salmon: "salmon",
  atun: "tuna",
  camaron: "prawn",
  camarones: "prawn",
  mariscos: "seafood",
  arroz: "rice",
  sopa: "soup",
  ensalada: "salad",
  postre: "dessert",
  pastel: "cake",
  torta: "cake",
  galletas: "cookies",
  pan: "bread",
  huevo: "egg",
  huevos: "egg",
  papa: "potato",
  papas: "potato",
  frijoles: "beans",
  queso: "cheese",
  chocolate: "chocolate",
  hongos: "mushroom",
  guiso: "stew",
  estofado: "stew",
  tarta: "tart",
  pay: "pie",
  empanada: "pie",
  hamburguesa: "burger",
  fideos: "noodles",
  lasana: "lasagne",
  lasagna: "lasagne",
};

function sinAcentos(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function etiquetaCategoria(nombre?: string) {
  if (!nombre) return "";
  return CATEGORIAS[nombre] ?? nombre;
}

export function etiquetaArea(nombre?: string) {
  if (!nombre) return "";
  return AREAS[nombre] ?? nombre;
}

/** Traduce un término de búsqueda en español a su equivalente en inglés, si lo conocemos. */
export function traducirBusqueda(termino: string) {
  const limpio = sinAcentos(termino.trim().toLowerCase());
  return BUSQUEDAS[limpio] ?? termino.trim();
}
