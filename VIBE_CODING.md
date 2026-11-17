# Proceso de Vibe Coding

Este documento registra cómo se construyó **Sazón** usando IA como copiloto: los prompts, las iteraciones, las decisiones técnicas y los problemas que aparecieron en el camino. El historial de commits del repositorio sigue el mismo orden que las iteraciones descritas aquí.

## Herramienta y flujo de trabajo

- **Asistente de IA:** Claude (modelo Opus 5.5, de Anthropic), usado desde claude.ai con un entorno de ejecución donde la IA puede crear archivos, instalar paquetes y correr comandos (`next build`, `eslint`, navegador sin interfaz para capturas).
- **Rol del estudiante:** definir el objetivo y las restricciones, revisar cada entrega, probar la app en local, decidir qué se integra, subir el código a GitHub y desplegar en Vercel.
- **Rol de la IA:** proponer arquitectura y diseño, generar el código por partes, ejecutar el build y el linter, probar en varios tamaños de pantalla y corregir lo que fallaba.

Ciclo seguido en cada iteración:

```
prompt / objetivo → código generado → next build + eslint → prueba en navegador → corrección → commit
```

## Prompt inicial

El punto de partida fue el enunciado completo de la actividad, pegado tal cual en el chat. Su núcleo:

> Construir una aplicación web funcional con Next.js 16 o superior (App Router) y TypeScript desde cero usando Vibe Coding. Mínimo 4 rutas, consumo de una API mediante Route Handlers o Supabase, combinación de Server y Client Components, `useState` y `useEffect`, diseño responsive, loading UI y error UI, variables de entorno en `.env.local`, despliegue público en Vercel y repositorio en GitHub con historial de commits, `.env.example`, README y documento del proceso. La temática es libre.

Por qué funcionó como prompt: incluye el objetivo, las restricciones técnicas verificables (versión, rutas, hooks, estados de carga/error) y los entregables. Con eso la IA puede convertir cada requisito en una tarea comprobable.

## Iteraciones

### 1. Concepción y base del proyecto
**Objetivo:** elegir temática y API, y generar el proyecto base.

- La IA propuso un explorador de recetas con **TheMealDB** porque es gratuita, tiene endpoints variados (búsqueda, detalle, categorías, aleatoria) y usa una clave que encaja con el requisito de `.env.local`.
- Se generó el proyecto con `create-next-app@16.4.6` (TypeScript, Tailwind, App Router, `src/`).
- **Hallazgo:** el proyecto generado trae un archivo `AGENTS.md` que advierte que Next.js 16 cambió APIs respecto a lo que una IA "recuerda". Por eso, antes de escribir código, la IA leyó la documentación incluida en `node_modules/next/dist/docs` (caching, Route Handlers, `error.js`, rutas dinámicas). Esto evitó errores como usar la prop `reset` en `error.tsx`, que en esta versión se llama `retry`.
- **Problema:** el build no podía descargar Google Fonts en el entorno de trabajo. **Solución:** usar `next/font/local` con los archivos de fuente dentro del repo, lo que además hace que el build en Vercel no dependa de ese servicio.

Commit: `chore: inicializa proyecto Next.js 16 con TypeScript, Tailwind y App Router`

### 2. Capa de datos y variables de entorno
**Objetivo:** "Crea un servicio que hable con TheMealDB solo desde el servidor, con la clave en variables de entorno, tipos en español y caché."

- `src/lib/mealdb.ts` con `import "server-only"` (si alguien lo importa desde un Client Component, el build falla) y funciones con `"use cache"` + `cacheLife`.
- Normalización de la respuesta cruda (por ejemplo, los 20 campos `strIngredient1..20` se convierten en un arreglo `ingredientes`).
- **Problema:** `.env.example` no aparecía en `git status`. El `.gitignore` generado ignora `.env*`, lo que también incluye el ejemplo. **Solución:** agregar la excepción `!.env.example`.

Commit: `feat: capa de datos de TheMealDB con tipos, caché y variables de entorno`

### 3. Route Handlers
**Objetivo:** "Expón una API interna en `/api` para que los Client Components nunca llamen directo a TheMealDB. Valida parámetros y responde errores en JSON con códigos HTTP correctos."

- 4 endpoints. Se probaron con `curl`: búsqueda válida (200), sin parámetros (400), id no numérico (400), id inexistente (404).
- **Decisión:** TheMealDB solo tiene contenido en inglés, así que la API traduce búsquedas frecuentes ("pollo" → "chicken", "lasaña" → "lasagne") y devuelve el término usado para que la interfaz lo explique.
- **Decisión:** `/api/recetas/aleatoria` llama a `connection()` para que Next.js nunca la prerenderice; si no, todos los usuarios verían la misma "receta al azar".

Commit: `feat: Route Handlers /api/recetas, /api/recetas/[id], /api/recetas/aleatoria y /api/categorias`

### 4. Diseño, layout e inicio
**Objetivo:** "Propón una identidad visual propia, que no parezca plantilla, adecuada a una app de cocina en español, responsive y accesible."

- La IA presentó un plan de diseño (paleta, tipografías, concepto) y lo revisó contra estilos genéricos antes de programar. Resultado: fondo verde salvia, verde cilantro para acciones, amarillo maíz para resaltar, fotos presentadas como **platos vistos desde arriba** (círculos con borde blanco) y un titular grande como elemento principal.
- Accesibilidad incluida desde el inicio: enlace "Saltar al contenido", foco visible, `aria-current`, `aria-live` en resultados y animaciones desactivadas con `prefers-reduced-motion`.

Commit: `feat: layout, navegación responsive y página de inicio`

### 5. Buscador en vivo (Client Component)
**Objetivo:** "Haz que la búsqueda muestre resultados mientras se escribe, sin saturar la API, y que la URL se pueda compartir."

- `useState` para término, categoría, resultados y estado; `useEffect` con **debounce de 400 ms** y **`AbortController`** para cancelar peticiones viejas (evita que una respuesta lenta pise a una más reciente).
- **Problema anticipado por el linter:** la regla `react-hooks/set-state-in-effect` de ESLint marca como error llamar `setState` directamente dentro de `useEffect`. Se diseñó el efecto para actualizar el estado solo dentro del callback asíncrono y se calcula "sin filtros" a partir del estado existente en lugar de guardarlo aparte.
- La página es un Server Component que obtiene las categorías y las pasa como props; el buscador usa `useSearchParams`, por eso va dentro de `<Suspense>`.

Commit: `feat: explorador de recetas con búsqueda en vivo (Client Component)`

### 6. Rutas dinámicas
**Objetivo:** "Crea el detalle de receta y las páginas de categoría con rutas dinámicas, metadatos por página y 404 para ids inválidos."

- **Error real en el build:**
  ```
  Route "/recetas/[id]": Next.js encountered URL data `usePathname()`
  in a Client Component outside of <Suspense>.
  ```
  Con Cache Components, la navegación del encabezado (que marca la página activa con `usePathname()`) bloqueaba el prerenderizado de las rutas dinámicas.
  - Intento 1 (propuesto por la IA): cambiar a `useSelectedLayoutSegment()`. **Falló con el mismo error.**
  - Intento 2: envolver la parte que lee la ruta en `<Suspense>` con un fallback que muestra los mismos enlaces sin marca de "activo". **Funcionó**, y el encabezado sigue siendo parte del HTML estático.
  - Lección: la primera sugerencia de la IA no siempre es correcta; el build es el que valida.
- `/categorias/[nombre]` usa `generateStaticParams` para prerenderizar todas las categorías en el build.
- Al pasar la receta al botón de favoritos (Client Component) se envía solo el resumen, no la receta completa, para no inflar el HTML.

Commit: `feat: detalle de receta y categorías con rutas dinámicas`

### 7. Favoritos y página "Cómo se hizo"
**Objetivo:** "Permite guardar favoritas sin cuenta de usuario y mostrar el contador en el encabezado."

- **Decisión:** `useSyncExternalStore` en lugar de `useState` + `useEffect` para leer `localStorage`. Varias partes de la interfaz (contador, botón y lista) necesitan el mismo dato y deben actualizarse juntas, incluso entre pestañas; además evita errores de hidratación.
- "Vaciar favoritos" pide confirmación con un segundo clic; un `useEffect` con `setTimeout` cancela la confirmación a los 4 segundos.

Commit: `feat: página de favoritos (localStorage) y página Cómo se hizo`

### 8. Estados de carga y error
**Objetivo:** "Agrega loading UI y error UI en cada segmento que depende de la API."

- `loading.tsx` con esqueletos con la misma forma que el contenido final, `error.tsx` por segmento con botón "Intentar de nuevo" (`retry`), `global-error.tsx` y `not-found.tsx`.

Commit: `feat: estados de carga, manejo de errores y página 404`

### 9. Validación y correcciones
**Objetivo:** "Prueba todo como lo haría un usuario y corrige lo que falle."

Como el entorno de la IA no tenía acceso a TheMealDB, se creó un **servidor mock** (`scripts/mock-mealdb.mjs`) y se apuntó la app a él cambiando solo `MEALDB_API_URL`. Esto también permitió simular caídas y lentitud. Luego se recorrieron todas las rutas con Playwright en 360, 390, 768 y 1024 px y se tomaron capturas.

| Problema encontrado | Causa | Solución |
| --- | --- | --- |
| En móvil, la página de inicio era 23 px más ancha que la pantalla | La columna implícita del grid tomaba el ancho mínimo del contenido | `grid-cols-1` (equivale a `minmax(0, 1fr)`) y un titular un poco más pequeño en móvil |
| `/recetas` medía 1489 px de ancho en móvil | `<fieldset>` tiene `min-inline-size: min-content` por defecto y estiraba los filtros | `min-w-0` en el fieldset |
| Con la API caída, `/api/recetas` respondía 500 "error inesperado" | Los errores lanzados dentro de funciones con `"use cache"` llegan serializados y pierden su clase (`MealDBError`) | El caso por defecto responde 502 con un mensaje claro |

También se verificó: la Loading UI con la API lenta, la Error UI con la API caída, el 404 con ids inexistentes y que no hubiera errores en la consola del navegador.

Commits: `fix: desbordes en móvil y manejo de errores de funciones cacheadas` y `chore: servidor mock de TheMealDB, ícono propio y licencias de fuentes`

### 10. Documentación y despliegue
README con instalación y requisitos cubiertos, este documento, `.env.example` y despliegue en Vercel.

## Decisiones técnicas (resumen)

| Decisión | Alternativa descartada | Motivo |
| --- | --- | --- |
| TheMealDB a través de Route Handlers | Llamar a la API desde el navegador | Clave en el servidor, validación, traducción y errores uniformes |
| Cache Components (`"use cache"`) | `export const revalidate` (modelo anterior) | Es el modelo por defecto en Next.js 16.4 y permite mezclar contenido estático y en streaming en la misma página |
| `useSyncExternalStore` para favoritos | `useState` + `useEffect` en cada componente | Un solo estado compartido y sincronizado entre pestañas |
| Fuentes locales | Google Fonts | Build independiente de servicios externos |
| Mock de la API | Probar solo en producción | Permite probar errores y lentitud de forma controlada |

## Qué aprendí del flujo con IA

- **El contexto importa más que el prompt perfecto.** Pedirle a la IA que leyera la documentación de la versión instalada evitó usar APIs viejas.
- **Validar siempre con herramientas, no con confianza.** El build, las pruebas con la API simulada y las capturas en varios tamaños encontraron cuatro errores en código que "se veía bien".
- **Iterar en pasos pequeños.** Cada commit corresponde a una funcionalidad probada; cuando algo fallaba, era fácil saber qué cambio lo causó.
- **La IA también se equivoca.** La primera solución al error de `usePathname()` no funcionó; hubo que probar, leer el error y ajustar.

## Mis iteraciones adicionales

> Espacio para registrar los prompts y cambios que hice después de recibir la primera versión (ajustes de diseño, textos, problemas en el despliegue, etc.).

| Fecha | Prompt o problema | Resultado |
| --- | --- | --- |
| | | |
