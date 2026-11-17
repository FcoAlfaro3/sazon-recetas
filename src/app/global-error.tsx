"use client";

// Se usa solo si falla el layout raíz: debe incluir <html> y <body>.
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem", background: "#f2f5ef", color: "#17241d" }}>
        <h1>Sazón no pudo cargar</h1>
        <p>Ocurrió un error inesperado. Intenta recargar la página.</p>
        <button
          type="button"
          onClick={() => retry()}
          style={{ marginTop: "1rem", padding: "0.6rem 1.2rem", borderRadius: "999px", border: 0, background: "#146b4a", color: "#fff", fontWeight: 600 }}
        >
          Intentar de nuevo
        </button>
      </body>
    </html>
  );
}
