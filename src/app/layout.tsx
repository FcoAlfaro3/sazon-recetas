import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";
import { SITIO } from "@/lib/sitio";
import "./globals.css";

// Fuentes locales (archivos en src/fonts) para no depender de Google Fonts
const bricolage = localFont({
  src: "../fonts/BricolageGrotesque.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

const instrument = localFont({
  src: [
    { path: "../fonts/InstrumentSans.woff2", weight: "400 700", style: "normal" },
    { path: "../fonts/InstrumentSans-Italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITIO.url),
  title: {
    default: `${SITIO.nombre}: recetas del mundo`,
    template: `%s | ${SITIO.nombre}`,
  },
  description: SITIO.descripcion,
  openGraph: {
    title: SITIO.nombre,
    description: SITIO.descripcion,
    type: "website",
    locale: "es_SV",
  },
};

export const viewport: Viewport = {
  themeColor: "#146b4a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bricolage.variable} ${instrument.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-niebla"
        >
          Saltar al contenido
        </a>
        <Encabezado />
        <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-5 pb-20 sm:px-8">
          {children}
        </main>
        <PiePagina />
      </body>
    </html>
  );
}
