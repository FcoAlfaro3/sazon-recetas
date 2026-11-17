# Sazón: explorador de recetas del mundo

Aplicación web construida con **Next.js 16 (App Router)**, **TypeScript** y **Tailwind CSS 4** siguiendo la metodología de **Vibe Coding**: una IA actuó como copiloto para generar código y diseño, y cada propuesta se revisó, probó y corrigió antes de integrarla.

Permite buscar recetas por nombre o ingrediente (también entiende palabras comunes en español), explorar por categoría, ver ingredientes y pasos, marcar los ingredientes que ya tienes, sortear una receta al azar y guardar favoritas en el navegador.

- **Sitio en producción:** https://sazon-recetas.vercel.app
- **Proceso de Vibe Coding:** [VIBE_CODING.md](./VIBE_CODING.md)
- **Datos:** [TheMealDB](https://www.themealdb.com/api.php) (API pública y gratuita)

---

## Funcionalidades y cómo se cumplen los requisitos

| Requisito | Dónde se cumple |
| --- | --- |
| Next.js 16+ con App Router | `next@16.4.6`, carpeta `src/app` |
| TypeScript | Todo el proyecto (`.ts` / `.tsx`), modo `strict` |
| Tailwind CSS | Tailwind 4 con tokens de diseño propios en `src/app/globals.css` |
| Mínimo 4 rutas | 7 páginas: `/`, `/recetas`, `/recetas/[id]`, `/categorias`, `/categorias/[nombre]`, `/favoritos`, `/acerca` |
| Consumo de API mediante Route Handlers | 4 endpoints en `src/app/api/**/route.ts` que envuelven a TheMealDB |
| Server + Client Components | Páginas y datos en el servidor; buscador, sorteo, favoritos, menú y checklist en el cliente |
| `useState` y `useEffect` | `ExploradorRecetas` (debounce + `AbortController`), `MenuMovil` (Escape y bloqueo de scroll), `ListaFavoritos`, `RecetaSorpresa`, `ListaIngredientes` |
| Diseño responsive | Probado en 360, 390, 768, 1024 y 1366 px; menú móvil propio |
| Loading UI | `loading.tsx` (raíz, `/recetas/[id]`, `/categorias`), `<Suspense>` con esqueletos |
| Error UI | `error.tsx` por segmento, `global-error.tsx`, `not-found.tsx` y estado de error dentro del buscador |
| Variables de entorno | `.env.local` (no se sube) y `.env.example` documentado |

## Rutas

| Ruta | Tipo | Descripción |
| --- | --- | --- |
| `/` | Server + Client | Hero con buscador, receta sorpresa y categorías destacadas |
| `/recetas` | Server + Client | Búsqueda en vivo con filtros por categoría; la URL se puede compartir |
| `/recetas/[id]` | Server + Client | Detalle con ingredientes marcables, pasos, video y botón de favoritos |
| `/categorias` | Server | Todas las categorías (cacheadas un día) |
| `/categorias/[nombre]` | Server | Recetas de una categoría, generadas en el build |
| `/favoritos` | Client | Recetas guardadas en `localStorage`, sincronizadas entre pestañas |
| `/acerca` | Server | Arquitectura y proceso de desarrollo |

## API interna (Route Handlers)

El navegador nunca llama directamente a TheMealDB: lo hace a través de estos endpoints, que mantienen la clave en el servidor, validan parámetros, traducen búsquedas y devuelven errores en JSON con el código HTTP correcto.

| Método y ruta | Respuesta |
| --- | --- |
| `GET /api/recetas?q=pollo&categoria=Chicken` | `{ recetas, total, terminoApi }`. Requiere `q` o `categoria` (si no, 400) |
| `GET /api/recetas/[id]` | Receta completa. 400 si el id no es numérico, 404 si no existe |
| `GET /api/recetas/aleatoria` | Una receta al azar (sin caché) |
| `GET /api/categorias` | `{ categorias, total }` |

## Estructura del proyecto

```
src/
├── app/
│   ├── api/                 # Route Handlers (API interna)
│   ├── recetas/             # /recetas y /recetas/[id] (+ loading y error)
│   ├── categorias/          # /categorias y /categorias/[nombre]
│   ├── favoritos/  acerca/
│   ├── layout.tsx           # Layout raíz, fuentes y metadatos
│   ├── loading.tsx  error.tsx  not-found.tsx  global-error.tsx
│   └── globals.css          # Tokens de diseño (Tailwind 4)
├── components/              # Componentes de UI (Server y Client)
├── hooks/useFavoritos.ts    # Favoritos con localStorage
├── lib/
│   ├── mealdb.ts            # Servicio server-only con "use cache"
│   ├── traducciones.ts      # Categorías, países y búsquedas en español
│   └── api-respuestas.ts    # Respuestas de error de la API
├── types/receta.ts          # Tipos de dominio
└── fonts/                   # Fuentes locales (licencia OFL)
scripts/mock-mealdb.mjs      # API falsa para probar sin internet
```

## Instalación local

Requisitos: **Node.js 20.9 o superior** y **Git**.

> En Windows, trabaja en una carpeta fuera de OneDrive (por ejemplo `C:\dev`) para evitar problemas al instalar dependencias.

```bash
# 1. Clonar el repositorio
git clone https://github.com/FcoAlfaro3/sazon-recetas.git
cd sazon-recetas

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno a partir del ejemplo
#    Windows (CMD):        copy .env.example .env.local
#    macOS / Linux / Git Bash: cp .env.example .env.local

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abre http://localhost:3000.

### Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `MEALDB_API_KEY` | Sí | Clave de TheMealDB. `1` es la clave pública de desarrollo. Solo se lee en el servidor. |
| `MEALDB_API_URL` | No | URL base de la API. Por defecto `https://www.themealdb.com/api/json/v1`. |
| `NEXT_PUBLIC_SITE_URL` | No | URL pública del sitio, usada en metadatos para compartir. |

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (prerenderiza páginas y consulta la API) |
| `npm start` | Sirve el build de producción |
| `npm run lint` | ESLint con las reglas de Next.js y React Hooks |
| `npm run typecheck` | Genera los tipos de rutas y valida TypeScript |
| `npm run mock` | Levanta una API falsa de TheMealDB en el puerto 4010 |

### Probar sin internet (mock)

```bash
npm run mock
```

En `.env.local` cambia `MEALDB_API_URL=http://localhost:4010/api/json/v1` y ejecuta `npm run dev` en otra terminal. Con http://localhost:4010/__fail?on=1 la API falsa responde con error (para ver la Error UI) y con http://localhost:4010/__delay?ms=2000 responde lento (para ver la Loading UI).

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com), elige **Add New → Project** e importa el repositorio.
3. Antes de pulsar **Deploy**, abre **Environment Variables** y agrega `MEALDB_API_KEY=1` y `NEXT_PUBLIC_SITE_URL=https://<tu-proyecto>.vercel.app`. El build consulta la API para prerenderizar las categorías, así que sin la clave falla.
4. Pulsa **Deploy**. Cada `git push` a `main` vuelve a desplegar automáticamente.

## Decisiones técnicas principales

- **Cache Components** (activado por defecto en Next.js 16.4): las lecturas a la API usan `"use cache"` + `cacheLife`, de modo que el inicio, las categorías y la lista del buscador se prerenderizan; el detalle de cada receta se sirve como _App Shell_ y el contenido llega en streaming.
- **Route Handlers como capa intermedia** entre el navegador y TheMealDB (clave en el servidor, validación, traducción y errores uniformes).
- **`useSyncExternalStore` para favoritos**, porque `localStorage` es un estado externo a React compartido por varios componentes.
- **Fuentes locales** con `next/font/local` en lugar de Google Fonts, para que el build no dependa de un servicio externo.

Más detalle, incluidos los errores encontrados y cómo se resolvieron, en [VIBE_CODING.md](./VIBE_CODING.md).

## Créditos

- Recetas e imágenes: [TheMealDB](https://www.themealdb.com).
- Tipografías: Bricolage Grotesque e Instrument Sans (SIL Open Font License).
- Desarrollado por Francisco Alfaro con asistencia de Claude (Anthropic) como copiloto de IA.
